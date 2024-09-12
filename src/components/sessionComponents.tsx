import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import React from "react";

import { ironSessionOptions, IronSessionData } from "@/src/lib/session";

/**
 * GetIronSessionData function retrieves the Iron Session data using the provided session options.
 *
 * @returns {Promise<IronSessionData>} The Iron Session data.
 */
export async function GetIronSessionData(): Promise<IronSessionData> {
  const ironSession = await getIronSession<IronSessionData>(
    cookies(),
    ironSessionOptions
  );

  return ironSession;
}

/**
 * RenderSessionData component fetches and displays the Iron Session data.
 * It retrieves the session data using GetIronSessionData and displays the auth and refresh tokens.
 *
 * @returns {JSX.Element} The rendered RenderSessionData component.
 */
export async function RenderSessionData(): Promise<JSX.Element> {
  const ironSession = await GetIronSessionData();

  return (
    <div>
      <div className="text-wrap">Auth Token: {ironSession.djAuthToken}</div>
      <div className="text-wrap">
        Refresh Token: {ironSession.djRefreshToken}
      </div>
    </div>
  );
}
