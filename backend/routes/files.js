// backend/routes/files.js
const express = require("express");
const router = express.Router();

// ⚠️ Ye line apne existing routes (jaise routes/applications.js) se copy karo,
// wahi auth middleware jo wahan use ho raha hai.
const auth = require("../middleware/auth");

const { downloadCloudinaryFile } = require("../utils/cloudinaryFile");

// GET /api/files/download?url=<cloudinary url>&name=resume.pdf
router.get("/download", auth, async (req, res) => {
  try {
    const { url, name } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ success: false, error: "url is required" });
    }

    // SSRF se bachne ke liye sirf Cloudinary URLs allow
    let host;
    try {
      host = new URL(url).hostname;
    } catch {
      return res.status(400).json({ success: false, error: "Invalid url" });
    }
    if (host !== "res.cloudinary.com") {
      return res
        .status(400)
        .json({ success: false, error: "Only Cloudinary files allowed" });
    }

    const upstream = await downloadCloudinaryFile(url);
    if (!upstream.ok) {
      return res.status(upstream.status === 404 ? 404 : 502).json({
        success: false,
        error: `File could not be fetched (HTTP ${upstream.status})`,
      });
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    const filename = String(name || "file.pdf").replace(/[^\w.\- ]/g, "_");
    const contentType =
      upstream.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);
    res.send(buffer);
  } catch (err) {
    console.error("File download error:", err);
    res.status(500).json({ success: false, error: "Could not load the file." });
  }
});

module.exports = router;
