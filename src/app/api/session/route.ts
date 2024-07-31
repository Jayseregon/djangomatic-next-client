import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

import { sessionOptions, SessionData } from "@/src/lib/session";

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (session.authToken || session.refreshToken) {
    return NextResponse.json({
      authToken: session.authToken,
      refreshToken: session.refreshToken,
    });
  } else {
    return NextResponse.json(
      { authToken: null, refreshToken: null },
      { status: 404 },
    );
  }
}
