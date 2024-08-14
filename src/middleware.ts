import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { auth } from "@/auth";

// New CSP middleware function
function cspMiddleware(req: NextRequest): NextResponse {
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
  connect-src 'self' https://github.com https://api.github.com https://docker-djangomatic.azurewebsites.net;
  upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(req.headers);

  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export default auth((req) => {
  const isDev = process.env.NODE_ENV === "development";
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  let response: NextResponse;

  // Allow access to the sign-in page without authentication
  if (
    nextUrl.pathname.startsWith("/api/auth/") ||
    nextUrl.pathname.startsWith("/signin")
  ) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  if (!isDev) {
    response = cspMiddleware(req);
  } else {
    response = NextResponse.next();
  }

  return response;
});

export const config = {
  matcher: [
    "/", // Ensures that the middleware is applied to the homepage.
    "/((?!_next|_vercel|.*\\..*).*)", // Ensures that the middleware is applied to all other routes except for Next.js internal routes and static files.
    "/((?!api|_next/static|_next/image|static|docs|favicon.ico).*)", // Ensures that the middleware is applied to all other routes except for API routes, Next.js static/image routes, static files, documentation, and the favicon.
  ],
};
