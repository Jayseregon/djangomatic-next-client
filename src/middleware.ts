import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { auth } from "@/auth";

/**
 * Middleware function to set Content Security Policy (CSP) headers.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {NextResponse} - The response object with CSP headers set.
 */
function cspMiddleware(req: NextRequest): NextResponse {
  // Generate a nonce for inline scripts
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Define the Content Security Policy header
  const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://github.com https://staging-djangomatic.azurewebsites.net https://djangomatic-pro.azurewebsites.net;
  style-src 'self' 'unsafe-inline' 'nonce-${nonce}' https://staging-djangomatic.azurewebsites.net https://djangomatic-pro.azurewebsites.net;
  img-src 'self' blob: data: https://i.pravatar.cc https://github.com https://avatars.githubusercontent.com https://*.githubusercontent.com https://djangomaticstorage.blob.core.windows.net;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors blob: https://staging-djangomatic.azurewebsites.net https://djangomatic-pro.azurewebsites.net;
  frame-src https://github.com blob:;
  connect-src 'self' https://github.com https://api.github.com https://docker-djangomatic.azurewebsites.net https://staging-djangomatic.azurewebsites.net https://djangomatic-pro.azurewebsites.net https://cdn.jsdelivr.net https://unpkg.com data:;
  media-src 'self' blob: https://djangomaticstorage.blob.core.windows.net;
  upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  // Clone the request headers and set the nonce and CSP header
  const requestHeaders = new Headers(req.headers);

  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  // Create a new response with the updated headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

/**
 * Main middleware function to handle authentication and apply CSP in production.
 *
 * @param {NextRequest} req - The incoming request object.
 * @returns {NextResponse} - The response object.
 */
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

  // Redirect to sign-in page if not logged in
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  // Apply CSP middleware in production
  if (!isDev) {
    response = cspMiddleware(req);
  } else {
    response = NextResponse.next();
  }

  return response;
});

/**
 * Configuration object for the middleware matcher.
 * Ensures that the middleware is applied to specific routes.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
    "/",
  ],
};
