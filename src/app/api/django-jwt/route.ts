import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const djAuthToken = cookieStore.get("djAuthToken")?.value;
  const djRefreshToken = cookieStore.get("djRefreshToken")?.value;
  const usedBackendUser = cookieStore.get("usedBackendUser")?.value;

  if (djAuthToken || djRefreshToken) {
    return NextResponse.json({
      djAuthToken: djAuthToken,
      djRefreshToken: djRefreshToken,
      usedBackendUser: usedBackendUser,
    });
  } else {
    return NextResponse.json(
      { djAuthToken: null, djRefreshToken: null, usedBackendUser: null },
      { status: 404 },
    );
  }
}

export async function POST() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function PATCH() {
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
