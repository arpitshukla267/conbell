const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const URL_REGEX =
  /^https:\/\/res\.cloudinary\.com\/([^/]+)\/(image|raw|video)\/(upload|authenticated|private)\/(?:v\d+\/)?(.+)$/;

function isOwnCloudinaryUrl(url) {
  const m = String(url || "").match(URL_REGEX);
  return !!m && m[1] === process.env.CLOUDINARY_CLOUD_NAME;
}

/** Tries the public URL first, then falls back to the authenticated API download. */
async function downloadCloudinaryFile(url) {
  let res = await fetch(url);
  if (res.ok) return res;

  const m = String(url).match(URL_REGEX);
  if (!m || m[1] !== process.env.CLOUDINARY_CLOUD_NAME) return res;

  const [, , resourceType, type, rest] = m;
  const decoded = decodeURIComponent(rest.split("?")[0]);
  const isRaw = resourceType === "raw";
  const publicId = isRaw ? decoded : decoded.replace(/\.[^/.]+$/, "");
  const format = isRaw ? "" : decoded.split(".").pop();

  const apiUrl = cloudinary.utils.private_download_url(publicId, format, {
    resource_type: resourceType,
    type,
    expires_at: Math.floor(Date.now() / 1000) + 300,
  });
  return fetch(apiUrl);
}

module.exports = { downloadCloudinaryFile, isOwnCloudinaryUrl };
