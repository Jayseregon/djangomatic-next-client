import { SessionOptions } from "iron-session";

export interface IronSessionData {
  authToken?: string | null;
  refreshToken?: string | null;
}

export const defaultIronSession: IronSessionData = {
  authToken: "",
  refreshToken: "",
};

export const ironSessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "iron-session-secure-cookie-auth-backend-jwt-token",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
