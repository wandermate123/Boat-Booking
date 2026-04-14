import { SITE_BASE_PATH } from "@/config/site";

/** Path for browser `fetch` to App Router handlers when using `basePath`. */
export function apiRoute(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_BASE_PATH}${p}`;
}
