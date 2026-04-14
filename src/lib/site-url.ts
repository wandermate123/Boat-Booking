import { SITE_BASE_PATH } from "@/config/site";

/**
 * Canonical public base URL for this deployment (includes `SITE_BASE_PATH`).
 * Set `NEXT_PUBLIC_APP_URL=https://wandermate.in/boating` in production.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercel) {
    const origin = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    return `${origin}${SITE_BASE_PATH}`;
  }
  return `http://localhost:3000${SITE_BASE_PATH}`;
}
