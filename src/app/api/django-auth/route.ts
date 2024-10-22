import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import { axiosInstance } from "@/src/lib/dbRequests";
import { ironSessionOptions, IronSessionData } from "@/src/lib/session";

const backendCredentialsMap: Record<
  string,
  { email: string | undefined; password: string | undefined }
> = {
  tds: {
    email: process.env.APP_TDS_USER_EMAIL,
    password: process.env.APP_TDS_USER_PASSWORD,
  },
  cogeco: {
    email: process.env.APP_COGECO_USER_EMAIL,
    password: process.env.APP_COGECO_USER_PASSWORD,
  },
  vistabeam: {
    email: process.env.APP_VISTABEAM_USER_EMAIL,
    password: process.env.APP_VISTABEAM_USER_PASSWORD,
  },
  xplore: {
    email: process.env.APP_XPLORE_USER_EMAIL,
    password: process.env.APP_XPLORE_USER_PASSWORD,
  },
};

const getBackendCredentials = (backendUser: string) => {
  return (
    backendCredentialsMap[backendUser] || {
      email: undefined,
      password: undefined,
    }
  );
};

export async function POST(request: Request) {
  const { backendUser } = await request.json();
  const { email, password } = getBackendCredentials(backendUser);

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
    ironSession.usedBackendUser = backendUser;
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
