const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const Admin = require("../models/Admin");

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Ensure local uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Same list as cms/lib/upload-context.ts
const ALLOWED_SECTIONS = [
  "products",
  "hero",
  "services",
  "process-steps",
  "assets",
  "clients",
  "resumes",
  "offer-letters",
];
const PUBLIC_SECTION = "resumes"; // website apply form
const PUBLIC_EXTS = [".pdf", ".doc", ".docx"];
const PUBLIC_MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ADMIN_MAX_BYTES = 15 * 1024 * 1024; // 15MB

// Multer config for local temp storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage, limits: { fileSize: ADMIN_MAX_BYTES } });

/* ---------- helpers ---------- */

// Token valid ho to req.isAdmin = true. Yaha reject nahi karta,
// kyunki section multer ke baad hi pata chalta hai.
async function detectAdmin(req, res, next) {
  req.isAdmin = false;
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findOne({ key: "admin" });
      if (admin && admin.tokenVersion === payload.v) req.isAdmin = true;
    }
  } catch {
    /* invalid token = admin nahi */
  }
  next();
}

const safeSegment = (v) =>
  String(v || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

const removeFiles = (files = []) => {
  for (const f of files) {
    try {
      if (f && f.path && fs.existsSync(f.path)) fs.unlinkSync(f.path);
    } catch {
      /* ignore */
    }
  }
};

/* ---------- route ---------- */

// POST /api/upload
router.post("/", detectAdmin, upload.any(), async (req, res, next) => {
  const files = req.files || [];
  const file = req.file || files[0];

  try {
    if (!file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const section = safeSegment(req.body.section);
    const identifier = safeSegment(req.body.identifier);

    // Section whitelist (section diya hai to valid hona chahiye)
    if (section && !ALLOWED_SECTIONS.includes(section)) {
      removeFiles(files);
      return res
        .status(400)
        .json({ success: false, error: "Invalid upload section" });
    }

    // Admin nahi hai to sirf resumes upload kar sakta hai
    if (!req.isAdmin) {
      if (section !== PUBLIC_SECTION) {
        removeFiles(files);
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      const ext = path.extname(file.originalname).toLowerCase();
      if (!PUBLIC_EXTS.includes(ext)) {
        removeFiles(files);
        return res
          .status(400)
          .json({
            success: false,
            error: "Sirf PDF, DOC ya DOCX file allowed hai",
          });
      }
      if (file.size > PUBLIC_MAX_BYTES) {
        removeFiles(files);
        return res
          .status(400)
          .json({
            success: false,
            error: "File 5MB se badi nahi honi chahiye",
          });
      }
    }

    // Sirf pehli file use hoti hai, baaki extra files delete
    removeFiles(files.filter((f) => f !== file));

    let folderPath = "conbell";
    if (section && identifier) folderPath = `conbell/${section}/${identifier}`;
    else if (section) folderPath = `conbell/${section}`;

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderPath,
        resource_type: "auto",
      });

      fs.unlinkSync(file.path); // local temp file hatao
      return res.json({ success: true, url: result.secure_url });
    }

    // Local upload
    return res.json({ success: true, url: `/uploads/${file.filename}` });
  } catch (error) {
    removeFiles(files); // cleanup on error
    next(error);
  }
});

module.exports = router;
