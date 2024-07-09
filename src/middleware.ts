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

// Refactored locale middleware function
function localeMiddleware(req: NextRequest) {
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
    const segments = req.nextUrl.pathname.split("/");
    if (segments[1] === nextLocale) {
      // Locale is already present in the path
      return response;
    }
    url.pathname = `/${nextLocale}${req.nextUrl.pathname}`;
    return NextResponse.redirect(url);
  }
  return response;
}

// New CSP middleware function
function cspMiddleware(response: NextResponse) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('x-nonce', nonce);
  return response;
}

// Combined middleware function
export function middleware(req: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';

  let response = localeMiddleware(req); 
  if (!isDev) {
    response = cspMiddleware(response); 
  }
  return response;
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",
    // Set a cookie to remember the previous locale
    "/(fr|en)/:path*",
    // Enable redirects that add missing locales
    "/((?!_next|_vercel|.*\\..*).*)",
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
