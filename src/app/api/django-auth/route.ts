import { NextResponse } from "next/server";

import { axiosInstance } from "@/src/lib/dbRequests";

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
  telus: {
    email: process.env.APP_TELUS_USER_EMAIL,
    password: process.env.APP_TELUS_USER_PASSWORD,
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

  try {
    const res = await axiosInstance.post("/api/dj-auth/login/", {
      email,
      password,
    });

    if (res.status !== 200) {
      throw new Error("Login failed");
    }

    const response = NextResponse.json({
      message: "Login successful",
    });
    const djAuthToken = res.data.access;
    const djRefreshToken = res.data.refresh;

    response.cookies.set("djAuthToken", djAuthToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    response.cookies.set("djRefreshToken", djRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    response.cookies.set("usedBackendUser", backendUser, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    return response;
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
