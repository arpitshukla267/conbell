const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const PasswordOtp = require("../models/PasswordOtp");
const requireAuth = require("../middleware/auth");
const { sendCmsMail } = require("../utils/mailer");

const router = express.Router();

const OTP_TTL_MS = 10 * 60 * 1000; // OTP validity: 10 minutes
const OTP_COOLDOWN_MS = 60 * 1000; // Minimum gap between OTP requests: 60 seconds
const MAX_OTP_ATTEMPTS = 5;

/* ---------- helpers ---------- */

const signToken = (admin) =>
  jwt.sign({ v: admin.tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const hashOtp = (otp) =>
  crypto.createHmac("sha256", process.env.JWT_SECRET).update(otp).digest("hex");

// On first run, the admin account is created from ADMIN_INITIAL_PASSWORD
async function getAdmin() {
  let admin = await Admin.findOne({ key: "admin" });
  if (!admin) {
    const initial = process.env.ADMIN_INITIAL_PASSWORD;
    if (!initial) {
      throw new Error(
        "ADMIN_INITIAL_PASSWORD is not configured in the environment.",
      );
    }
    admin = await Admin.create({
      passwordHash: await bcrypt.hash(initial, 12),
    });
  }
  return admin;
}

// Simple in-memory login rate limit: 10 attempts per 15 minutes per IP
const loginHits = new Map();
function loginLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const rec = loginHits.get(ip);
  if (!rec || rec.resetAt < now) {
    loginHits.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return next();
  }
  if (rec.count >= 10) {
    return res.status(429).json({
      error: "Too many login attempts. Please try again in 15 minutes.",
    });
  }
  rec.count++;
  next();
}

/* ---------- routes ---------- */

// POST /api/auth/login  { password }
router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { password } = req.body || {};
    if (!password) {
      return res.status(400).json({ error: "Please enter your password." });
    }

    const admin = await getAdmin();
    const ok = await bcrypt.compare(String(password), admin.passwordHash);
    if (!ok) return res.status(401).json({ error: "Incorrect password." });

    res.json({ token: signToken(admin) });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me  -> verifies whether the token is valid
router.get("/me", requireAuth, (req, res) => res.json({ ok: true }));

// POST /api/auth/password/send-otp
router.post("/password/send-otp", requireAuth, async (req, res, next) => {
  try {
    const to = process.env.PASS_RESET;
    if (!to) {
      return res.status(500).json({
        error: "The password reset email address is not configured.",
      });
    }

    const recent = await PasswordOtp.findOne({
      createdAt: { $gt: new Date(Date.now() - OTP_COOLDOWN_MS) },
    });
    if (recent) {
      return res.status(429).json({
        error: "Please wait one minute before requesting another OTP.",
      });
    }

    const otp = String(crypto.randomInt(100000, 1000000));
    await PasswordOtp.deleteMany({});
    const record = await PasswordOtp.create({
      otpHash: hashOtp(otp),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    });

    try {
      // Sent from the CMS domain (cms.conbellengineering.com)
      await sendCmsMail({
        to,
        subject: "Conbell CMS - Password Reset OTP",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto">
            <h2 style="color:#00355F">Password Reset OTP</h2>
            <p>Your one-time password (OTP) is:</p>
            <p style="font-size:30px;font-weight:bold;letter-spacing:8px;color:#00355F">${otp}</p>
            <p>This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
          </div>`,
        text: `Your Conbell CMS password reset OTP is ${otp}. It is valid for 10 minutes. If you did not request this, please ignore this email.`,
      });
    } catch (mailErr) {
      await PasswordOtp.deleteOne({ _id: record._id });
      throw mailErr;
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/password/reset  { otp, newPassword }
router.post("/password/reset", requireAuth, async (req, res, next) => {
  try {
    const { otp, newPassword } = req.body || {};

    if (!/^\d{6}$/.test(String(otp || ""))) {
      return res
        .status(400)
        .json({ error: "Please enter a valid 6-digit OTP." });
    }
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long." });
    }

    const record = await PasswordOtp.findOne({
      expiresAt: { $gt: new Date() },
    });
    if (!record) {
      return res.status(400).json({
        error: "The OTP has expired. Please request a new one.",
      });
    }
    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      await PasswordOtp.deleteOne({ _id: record._id });
      return res.status(429).json({
        error: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    const a = Buffer.from(hashOtp(String(otp)));
    const b = Buffer.from(record.otpHash);
    const match = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!match) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ error: "Incorrect OTP." });
    }

    const admin = await getAdmin();
    admin.passwordHash = await bcrypt.hash(newPassword, 12);
    admin.tokenVersion += 1; // Invalidates all previously issued sessions
    await admin.save();
    await PasswordOtp.deleteMany({});

    // Issue a fresh token so the current session stays signed in
    res.json({ success: true, token: signToken(admin) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
