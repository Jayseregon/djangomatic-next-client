import type { NextRequest } from "next/server";

import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

import { auth } from "@/auth";

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
  // Check if the request is for an API route and bypass the locale handling
  if (
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/login")
  ) {
    return NextResponse.next();
  }

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
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://github.com;
  style-src 'self' 'nonce-${nonce}';
  img-src 'self' blob: data: https://i.pravatar.cc https://github.com https://avatars.githubusercontent.com https://*.githubusercontent.com;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src https://github.com;
  connect-src 'self' https://github.com https://api.github.com;
  upgrade-insecure-requests;
`
    .replace(/\s{2,}/g, " ")
    .trim();

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("x-nonce", nonce);

  return response;
}

export default auth((req) => {
  const isDev = process.env.NODE_ENV === "development";
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Allow access to the sign-in page without authentication
  if (nextUrl.pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    // return NextResponse.redirect(new URL('/api/auth/signin', nextUrl))
    // return NextResponse.redirect(new URL("/signin", nextUrl));
  }

  let response = localeMiddleware(req);

  if (!isDev) {
    response = cspMiddleware(response);
  }

  return response;
});

export const config = {
  matcher: [
    "/", // Ensures that the middleware is applied to the homepage.
    "/(fr|en)/:path*", // Ensures that the middleware is applied to URLs prefixed with the locale (fr for French, en for English).
    "/((?!_next|_vercel|.*\\..*).*)", // Ensures that the middleware is applied to all other routes except for Next.js internal routes and static files.
    "/((?!api|_next/static|_next/image|static|docs|favicon.ico).*)", // Ensures that the middleware is applied to all other routes except for API routes, Next.js static/image routes, static files, documentation, and the favicon.
  ],
};
