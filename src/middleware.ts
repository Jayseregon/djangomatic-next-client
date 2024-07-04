import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { localePrefix, defaultLocale, locales, pathnames } from "./config";

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
  const nextLocale = req.cookies.get("NEXT_LOCALE")?.value;

  if (
    nextLocale &&
    typeof nextLocale === "string" &&
    currentLocale !== nextLocale &&
    locales.includes(nextLocale as "en" | "fr")
  ) {
    // If the locale has changed, redirect to the same URL with the new locale
    const url = req.nextUrl.clone();

    // Ensure we do not add the locale multiple times
    const segments = req.nextUrl.pathname.split('/');
    if (segments[1] === nextLocale) {
      // Locale is already present in the path
      return response;
    }

    url.pathname = `/${nextLocale}${req.nextUrl.pathname}`;
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