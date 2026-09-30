const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const {
  downloadCloudinaryFile,
  isOwnCloudinaryUrl,
} = require("../utils/cloudinaryFile");

// GET /api/files/download?url=...&name=Resume.pdf   (admin only)
router.get("/download", requireAuth, async (req, res, next) => {
  try {
    const { url, name } = req.query;
    if (!isOwnCloudinaryUrl(url)) {
      return res.status(400).json({ error: "Invalid file URL." });
    }

    const upstream = await downloadCloudinaryFile(url);
    if (!upstream.ok) {
      return res
        .status(502)
        .json({
          error: `File could not be retrieved (HTTP ${upstream.status}).`,
        });
    }

    const filename =
      String(name || "file")
        .replace(/[^a-zA-Z0-9._ -]/g, "_")
        .slice(0, 100) || "file";
    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") || "application/octet-stream",
    );
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
