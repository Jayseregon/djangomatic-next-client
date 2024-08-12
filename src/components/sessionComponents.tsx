import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import React from "react";

import { ironSessionOptions, IronSessionData } from "@/src/lib/session";

export async function GetIronSessionData() {
  const ironSession = await getIronSession<IronSessionData>(
    cookies(),
    ironSessionOptions,
  );

  return ironSession;
}

export async function RenderSessionData() {
  const ironSession = await GetIronSessionData();

  return (
    <div>
      <div>Auth Token: {ironSession.djAuthToken}</div>
      <div>Refresh Token: {ironSession.djRefreshToken}</div>
    </div>
  );
}
