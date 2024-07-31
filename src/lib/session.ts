import { SessionOptions } from "iron-session";

export interface SessionData {
  authToken?: string | null;
  refreshToken?: string | null;
}

export const defaultSession: SessionData = {
  authToken: "",
  refreshToken: "",
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "iron-session-secure-cookie-auth-backend-jwt-token",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
