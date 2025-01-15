"use server";

import { cookies } from "next/headers";
import { createCsrfMiddleware } from "@edge-csrf/nextjs";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { UserSchema } from "@/src/interfaces/lib";

const prisma = new PrismaClient();

const csrfMiddleware = createCsrfMiddleware({
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Match your CSRF security requirements
  },
});

export async function getServerCsrfToken(): Promise<string> {
  try {
    // Try to get existing token from cookies first
    const cookieStore = await cookies();
    const existingToken = cookieStore.get("csrf-token")?.value;

    if (existingToken) {
      return existingToken;
    }

    // If no token exists, generate a new one
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const host = process.env.NEXT_PUBLIC_BASE_URL || "localhost:3000";
    const url = `${protocol}://${host}`;

    // Create request with minimal context
    const request = new NextRequest(url, {
      method: "GET",
      headers: new Headers({
        host: host,
        "x-csrf-protection": "1",
      }),
    });

    const response = await csrfMiddleware(request);
    const newToken = response.headers.get("X-CSRF-Token");

    if (!newToken) {
      throw new Error("Failed to generate CSRF token");
    }

    // Store new token in cookies
    cookieStore.set("csrf-token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return newToken;
  } catch (error: any) {
    console.error("CSRF token retrieval/generation failed:", error.message);

    return "missing";
  }
}

export async function fetchUserServer(
  email: string,
): Promise<UserSchema | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: z.string().parse(email) },
    });

    if (!user) return null;

    // Return an empty rndTasks array to satisfy UserSchema
    return { ...user, rndTasks: [] };
  } catch (error: any) {
    console.error("Failed to fetch user:", error);

    return null;
  }
}
