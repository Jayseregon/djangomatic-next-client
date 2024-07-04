import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { localePrefix, defaultLocale, locales, pathnames } from "./config";
import { getCookie } from 'cookies-next';

// Existing middleware configuration
const intlMiddleware = createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
  pathnames,
  localeDetection: false,
});

// Extend the middleware to handle locale changes
export default function middleware(req: NextRequest) {
  // Use the existing intl middleware to handle initial locale setup
  const response = intlMiddleware(req);

  // Check if the NEXT_LOCALE cookie is set and if it's different from the current locale
  const currentLocale = req.nextUrl.locale;
  const nextLocale = req.cookies.get("NEXT_LOCALE");

  if (
    nextLocale &&
    typeof nextLocale === "string" &&
    currentLocale !== nextLocale
  ) {
    // If the locale has changed, redirect to the same URL with the new locale
    const url = req.nextUrl.clone();
    url.locale = nextLocale;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(fr|en)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
