import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import { axiosInstance } from "@/src/lib/dbRequests";
import { ironSessionOptions, IronSessionData } from "@/src/lib/session";

export async function POST() {
  const email = process.env.USER_EMAIL as string;
  const password = process.env.USER_PASSWORD as string;

  const ironSession = await getIronSession<IronSessionData>(
    cookies(),
    ironSessionOptions,
  );

  try {
    const response = await axiosInstance.post("/api/dj-auth/login/", {
      email,
      password,
    });

    const { access, refresh } = response.data;

    ironSession.djAuthToken = access;
    ironSession.djRefreshToken = refresh;
    await ironSession.save();

    if (response.status !== 200) {
      throw new Error("Login failed");
    }

    return NextResponse.json({
      message: "Login successful",
      headers: response.headers,
      data: response.data,
    });
  } catch (error: any) {
    console.error("Route Login FAILED:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function PUT() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function DELETE() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function OPTIONS() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
