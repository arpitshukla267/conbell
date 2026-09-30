const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const PasswordOtp = require("../models/PasswordOtp");
const requireAuth = require("../middleware/auth");
const { sendMail } = require("../utils/mailer");

const router = express.Router();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 min
const OTP_COOLDOWN_MS = 60 * 1000; // resend 60 sec baad
const MAX_OTP_ATTEMPTS = 5;

/* ---------- helpers ---------- */

const signToken = (admin) =>
  jwt.sign({ v: admin.tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const hashOtp = (otp) =>
  crypto.createHmac("sha256", process.env.JWT_SECRET).update(otp).digest("hex");

// pehli baar chalne par admin ADMIN_INITIAL_PASSWORD se ban jaata hai
async function getAdmin() {
  let admin = await Admin.findOne({ key: "admin" });
  if (!admin) {
    const initial = process.env.ADMIN_INITIAL_PASSWORD;
    if (!initial)
      throw new Error("ADMIN_INITIAL_PASSWORD .env me set nahi hai");
    admin = await Admin.create({
      passwordHash: await bcrypt.hash(initial, 12),
    });
  }
  return admin;
}

// simple in-memory login rate limit: 10 attempts / 15 min / IP
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
    return res
      .status(429)
      .json({ error: "Bahut zyada attempts, 15 min baad try karo" });
  }
  rec.count++;
  next();
}

/* ---------- routes ---------- */

// POST /api/auth/login  { password }
router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { password } = req.body || {};
    if (!password) return res.status(400).json({ error: "Password daalo" });

    const admin = await getAdmin();
    const ok = await bcrypt.compare(String(password), admin.passwordHash);
    if (!ok) return res.status(401).json({ error: "Incorrect password" });

    res.json({ token: signToken(admin) });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me  -> token valid hai ya nahi
router.get("/me", requireAuth, (req, res) => res.json({ ok: true }));

// POST /api/auth/password/send-otp
router.post("/password/send-otp", requireAuth, async (req, res, next) => {
  try {
    const to = process.env.PASS_RESET;
    if (!to)
      return res
        .status(500)
        .json({ error: "PASS_RESET email configure nahi hai" });

    const recent = await PasswordOtp.findOne({
      createdAt: { $gt: new Date(Date.now() - OTP_COOLDOWN_MS) },
    });
    if (recent) {
      return res
        .status(429)
        .json({ error: "Thoda ruko, 1 minute baad dobara OTP maango" });
    }

    const otp = String(crypto.randomInt(100000, 1000000));
    await PasswordOtp.deleteMany({});
    const record = await PasswordOtp.create({
      otpHash: hashOtp(otp),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    });

    try {
      await sendMail({
        to,
        subject: "Conbell CMS - Password Reset OTP",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto">
            <h2 style="color:#00355F">Password Reset OTP</h2>
            <p>Aapka OTP:</p>
            <p style="font-size:30px;font-weight:bold;letter-spacing:8px;color:#00355F">${otp}</p>
            <p>Ye 10 minute tak valid hai. Agar aapne request nahi ki, isse ignore karein.</p>
          </div>`,
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
      return res.status(400).json({ error: "6 digit ka OTP daalo" });
    }
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: "Password kam se kam 8 characters ka ho" });
    }

    const record = await PasswordOtp.findOne({
      expiresAt: { $gt: new Date() },
    });
    if (!record) {
      return res
        .status(400)
        .json({ error: "OTP expire ho gaya, naya OTP maango" });
    }
    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      await PasswordOtp.deleteOne({ _id: record._id });
      return res
        .status(429)
        .json({ error: "Bahut galat attempts, naya OTP maango" });
    }

    const a = Buffer.from(hashOtp(String(otp)));
    const b = Buffer.from(record.otpHash);
    const match = a.length === b.length && crypto.timingSafeEqual(a, b);

    if (!match) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ error: "Galat OTP" });
    }

    const admin = await getAdmin();
    admin.passwordHash = await bcrypt.hash(newPassword, 12);
    admin.tokenVersion += 1; // baaki sab purane sessions logout
    await admin.save();
    await PasswordOtp.deleteMany({});

    // naya token do taaki current session logged-in rahe
    res.json({ success: true, token: signToken(admin) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
