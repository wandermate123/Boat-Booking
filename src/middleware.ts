import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SITE_BASE_PATH } from "@/config/site";

const BASE = SITE_BASE_PATH;

const STATIC_EXT = /\.(?:ico|png|jpe?g|gif|webp|svg|txt|xml|webmanifest|woff2?)$/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === BASE || pathname.startsWith(`${BASE}/`)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/_next")) {
    const url = request.nextUrl.clone();
    url.pathname = `${BASE}${pathname}`;
    return NextResponse.redirect(url);
  }

  if (STATIC_EXT.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `${BASE}${pathname}`;
    return NextResponse.redirect(url);
  }

  // Wrong origin for handlers — clients should use apiRoute(); avoid redirecting POST /api
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? BASE : `${BASE}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/", "/((?!boating/).*)"],
};
