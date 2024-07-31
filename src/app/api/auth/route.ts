import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import { sessionOptions, SessionData } from "@/src/lib/session";
import { axiosInstance } from "@/src/lib/dbRequests";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  try {
    const response = await axiosInstance.post("/api/auth/login/", {
      email,
      password,
    });

    const { access, refresh } = response.data;

    session.authToken = access;
    session.refreshToken = refresh;
    await session.save();

    if (response.status !== 200) {
      throw new Error("Login failed");
    }

    return NextResponse.json({
      message: "Login successful",
      headers: response.headers,
      data: response.data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
