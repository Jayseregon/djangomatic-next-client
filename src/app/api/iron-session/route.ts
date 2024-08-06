import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

import { ironSessionOptions, IronSessionData } from "@/src/lib/session";

export async function GET() {
  const ironSession = await getIronSession<IronSessionData>(
    cookies(),
    ironSessionOptions
  );

  if (ironSession.djAuthToken || ironSession.djRefreshToken) {
    return NextResponse.json({
      djAuthToken: ironSession.djAuthToken,
      djRefreshToken: ironSession.djRefreshToken,
    });
  } else {
    return NextResponse.json(
      { djAuthToken: null, djRefreshToken: null },
      { status: 404 }
    );
  }
}
