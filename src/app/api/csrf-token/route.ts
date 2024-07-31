import { NextRequest, NextResponse } from "next/server";
import { createCsrfMiddleware } from "@edge-csrf/nextjs";

const csrfMiddleware = createCsrfMiddleware({
  cookie: {
    secure: process.env.NODE_ENV === "production",
  },
});

export async function GET(req: NextRequest) {
  const response = await csrfMiddleware(req);
  const csrfToken = response.headers.get("X-CSRF-Token");

  // Set the CSRF token in the response headers or cookies if needed
  const res = NextResponse.json({ csrfToken });

  res.headers.set("X-CSRF-Token", csrfToken || "");

  return res;
}
