const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const FRONTEND = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

/**
 * Resolve stored image/PDF paths for CMS previews.
 *
 * - Full URLs (http/https) → returned as-is (Cloudinary, external)
 * - /uploads/*              → served by the backend API server
 * - Any other /path         → served by the frontend (lives in frontend/public/)
 */
export function resolveMediaUrl(src: string): string {
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/uploads/")) return `${API}${src}`;
  // All other local paths (e.g. /hero/hero1.webp, /products/..., /clients/logos/...)
  // live inside frontend/public/ and are served by the frontend dev server.
  if (src.startsWith("/")) return `${FRONTEND}${src}`;
  return src;
}

export function isCloudinaryUrl(src: string): boolean {
  return src.includes("res.cloudinary.com");
}
