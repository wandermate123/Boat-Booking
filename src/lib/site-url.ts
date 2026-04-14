/**
 * Canonical public base URL for this deployment (no path prefix).
 * Set `NEXT_PUBLIC_APP_URL=https://your-domain.com` in production.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.replace(/\/$/, "");
  if (vercel) {
    const origin = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    return origin;
  }
  return "http://localhost:3000";
}
