import { SessionOptions } from "iron-session";

export interface IronSessionData {
  djAuthToken?: string | null;
  djRefreshToken?: string | null;
  clientAuthToken?: string | null;
}

export const defaultIronSession: IronSessionData = {
  djAuthToken: "",
  djRefreshToken: "",
  clientAuthToken: "",
};

export const ironSessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "iron-session-secure-cookie-auth-backend-jwt-token",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
