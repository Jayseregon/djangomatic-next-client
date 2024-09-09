import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

// import axios from "axios";
import { axiosInstance } from "@/src/lib/dbRequests";
import { ironSessionOptions, IronSessionData } from "@/src/lib/session";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const ironSession = await getIronSession<IronSessionData>(
    cookies(),
    ironSessionOptions,
  );

  // console.error("RECEIVED EMAIL:", email);
  // console.error("RECEIVED PWD:", password);

  try {
    // const response = await axios.post(
    //   "https://docker-djangomatic.azurewebsites.net/api/dj-auth/login/",
    //   {
    //     email,
    //     password,
    //   }
    // );

    const response = await axiosInstance.post("/api/dj-auth/login/", {
      email,
      password,
    });

    // console.error("Route Login RESPONSE:", response);

    const { access, refresh } = response.data;

    ironSession.djAuthToken = access;
    ironSession.djRefreshToken = refresh;
    await ironSession.save();

    if (response.status !== 200) {
      // throw new Error(
      //   `Login failed... response status: ${response.status} - headers: ${JSON.stringify(response.headers)} - data: ${JSON.stringify(response.data)}`
      // );
      throw new Error("Login failed");
    }

    return NextResponse.json({
      message: "Login successful",
      headers: response.headers,
      data: response.data,
    });
  } catch (error: any) {
    console.error("Route Login FAILED:", error);

    // console.error("Error details:", error.response?.data || error.message);
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
