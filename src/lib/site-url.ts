import "server-only";

/**
 * Canonical origin used for metadata, sitemap and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL to the production domain (e.g. https://www.cafe17.in).
 * On Vercel it falls back to the production deployment URL automatically.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
