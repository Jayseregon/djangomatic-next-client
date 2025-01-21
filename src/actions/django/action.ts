"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

import { axiosInstance } from "@/lib/dbRequests";

// Add type for tokens
export type TokenResponse = {
  djAuthToken: string;
  djRefreshToken?: string; // Make refresh token optional
  usedBackendUser: string;
};

// Type guard for token validation
function isValidTokenResponse(
  tokens: Partial<TokenResponse> | null,
): tokens is TokenResponse {
  if (!tokens?.djAuthToken || !tokens?.usedBackendUser) {
    return false;
  }

  return validateTokens(tokens.djAuthToken);
}

const backendCredentialsMap: Record<
  string,
  { email: string | undefined; password: string | undefined }
> = {
  tds: {
    email: process.env.APP_TDS_USER_EMAIL,
    password: process.env.APP_TDS_USER_PASSWORD,
  },
  cogeco: {
    email: process.env.APP_COGECO_USER_EMAIL,
    password: process.env.APP_COGECO_USER_PASSWORD,
  },
  vistabeam: {
    email: process.env.APP_VISTABEAM_USER_EMAIL,
    password: process.env.APP_VISTABEAM_USER_PASSWORD,
  },
  xplore: {
    email: process.env.APP_XPLORE_USER_EMAIL,
    password: process.env.APP_XPLORE_USER_PASSWORD,
  },
  telus: {
    email: process.env.APP_TELUS_USER_EMAIL,
    password: process.env.APP_TELUS_USER_PASSWORD,
  },
};

const isTokenExpired = (token: string) => {
  try {
    const decodedToken = jwtDecode(token);

    if (!decodedToken || !decodedToken.exp) {
      return true;
    }
    const expiryDate = new Date(decodedToken.exp * 1000);

    return expiryDate < new Date();
  } catch (error) {
    console.error("Error decoding token:", error);

    return true;
  }
};

const validateTokens = (token: string): boolean => {
  return Boolean(token) && !isTokenExpired(token);
};

export async function makeServerLoginRequest(backendUser: string) {
  const credentials = backendCredentialsMap[backendUser] || {
    email: undefined,
    password: undefined,
  };

  try {
    if (!credentials.email || !credentials.password) {
      throw new Error(`Missing credentials for ${backendUser}`);
    }

    const res = await axiosInstance.post("/api/dj-auth/login/", {
      email: credentials.email,
      password: credentials.password,
    });

    if (res.status !== 200) {
      throw new Error("Login failed");
    }

    const cookieStore = await cookies();

    cookieStore.set("djAuthToken", res.data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    cookieStore.set("djRefreshToken", res.data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    cookieStore.set("usedBackendUser", backendUser, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    return { success: true };
  } catch (error: any) {
    console.error("Authentication failed:", {
      user: backendUser,
      error: error.message,
    });
    throw error;
  }
}

export async function getServerTokens(
  backendUser: string,
): Promise<TokenResponse | null> {
  try {
    const cookieStore = await cookies();
    const tokens = {
      djAuthToken: cookieStore.get("djAuthToken")?.value,
      djRefreshToken: cookieStore.get("djRefreshToken")?.value, // This is now optional
      usedBackendUser: cookieStore.get("usedBackendUser")?.value,
    };

    if (!isValidTokenResponse(tokens)) {
      await makeServerLoginRequest(backendUser);
      const updatedCookieStore = await cookies();
      const newTokens = {
        djAuthToken: updatedCookieStore.get("djAuthToken")?.value,
        djRefreshToken: updatedCookieStore.get("djRefreshToken")?.value,
        usedBackendUser: updatedCookieStore.get("usedBackendUser")?.value,
      };

      return isValidTokenResponse(newTokens) ? newTokens : null;
    }

    if (tokens.usedBackendUser !== backendUser) {
      await makeServerLoginRequest(backendUser);
      const updatedCookieStore = await cookies();
      const newTokens = {
        djAuthToken: updatedCookieStore.get("djAuthToken")?.value,
        djRefreshToken: updatedCookieStore.get("djRefreshToken")?.value,
        usedBackendUser: updatedCookieStore.get("usedBackendUser")?.value,
      };

      return isValidTokenResponse(newTokens) ? newTokens : null;
    }

    return tokens;
  } catch (error: any) {
    console.error("Token retrieval failed:", {
      user: backendUser,
      error: error.message,
    });

    return null;
  }
}
