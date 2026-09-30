// backend/utils/cloudinaryFile.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CLOUDINARY_URL_RE =
  /res\.cloudinary\.com\/[^/]+\/(image|raw|video)\/(upload|authenticated|private)\/(?:v\d+\/)?(.+)$/;

function isCloudinaryUrl(url) {
  return typeof url === "string" && CLOUDINARY_URL_RE.test(url);
}

/**
 * Downloads a Cloudinary asset with signed credentials (Admin download API),
 * so public delivery restrictions (401 on PDFs) do not apply.
 * Returns a fetch Response (use res.ok / res.status / res.arrayBuffer()).
 */
async function downloadCloudinaryFile(url) {
  const m = typeof url === "string" ? url.match(CLOUDINARY_URL_RE) : null;

  if (m) {
    const [, resourceType, type, rest] = m;
    const decoded = decodeURIComponent(rest.split("?")[0]);
    const isRaw = resourceType === "raw";
    // raw: public_id me extension shamil hota hai; image/video me alag format
    const publicId = isRaw ? decoded : decoded.replace(/\.[^/.]+$/, "");
    const format = isRaw ? "" : decoded.split(".").pop();

    const signedUrl = cloudinary.utils.private_download_url(publicId, format, {
      resource_type: resourceType,
      type,
      expires_at: Math.floor(Date.now() / 1000) + 300,
    });

    const signedRes = await fetch(signedUrl);
    if (signedRes.ok) return signedRes;

    console.error(
      `Cloudinary signed download failed (${signedRes.status}) for ${url}`,
    );

    // last try: plain public URL
    const plainRes = await fetch(url);
    return plainRes.ok ? plainRes : signedRes;
  }

  return fetch(url);
}

module.exports = { downloadCloudinaryFile, isCloudinaryUrl };
