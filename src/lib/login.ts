import { NextRequest, NextResponse } from "next/server";

import { getSession } from "./session";
import { axiosInstance } from "./dbRequests";

export async function makeLogin(req: NextRequest, res: NextResponse) {
  const session = await getSession(req, res);
  const email = "test@test.com";
  const password = "django123";

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
  } catch (error: any) {
    console.error("Error while login:", error);
  }
}
