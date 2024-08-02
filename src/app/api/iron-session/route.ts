import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

import { ironSessionOptions, IronSessionData } from "@/src/lib/session";

export async function GET() {
  const ironSession = await getIronSession<IronSessionData>(
    cookies(),
    ironSessionOptions
  );

  if (ironSession.authToken || ironSession.refreshToken) {
    return NextResponse.json({
      authToken: ironSession.authToken,
      refreshToken: ironSession.refreshToken,
    });
  } else {
    return NextResponse.json(
      { authToken: null, refreshToken: null },
      { status: 404 }
    );
  }
}
