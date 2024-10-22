import { SessionOptions } from "iron-session";

export interface IronSessionData {
  djAuthToken?: string | null;
  djRefreshToken?: string | null;
  clientAuthToken?: string | null;
  usedBackendUser?: string | null;
}

/**
 * Default values for Iron Session Data.
 */
export const defaultIronSession: IronSessionData = {
  djAuthToken: "",
  djRefreshToken: "",
  clientAuthToken: "",
  usedBackendUser: "",
};

/**
 * Options for configuring Iron Session.
 */
export const ironSessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "iron-session-secure-cookie-auth-backend-jwt-token",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
