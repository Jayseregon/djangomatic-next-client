import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import React from "react";

import { sessionOptions, SessionData } from "@/src/lib/session";

export async function GetIronSessionData() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  return session;
}

export async function RenderSessionData() {
  const session = await GetIronSessionData();

  return (
    <div>
      <div>Auth Token: {session.authToken}</div>
      <div>Refresh Token: {session.refreshToken}</div>
    </div>
  );
}
