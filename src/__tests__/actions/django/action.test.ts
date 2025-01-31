import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

import {
  makeServerLoginRequest,
  getServerTokens,
} from "@/actions/django/action";
import { axiosInstance } from "@/lib/dbRequests";

// Mock dependencies
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

jest.mock("@/lib/dbRequests", () => ({
  axiosInstance: {
    post: jest.fn(),
  },
}));

// Mock console.error to prevent logging during tests
const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

describe("Django Authentication Actions", () => {
  const mockCookieStore = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const validToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTl9";
  const expiredToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjM0NTY3ODl9";

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    // Reset environment variables with correct structure
    process.env = {
      ...process.env,
      APP_TDS_USER_EMAIL: "test@example.com",
      APP_TDS_USER_PASSWORD: "password123",
    };

    // Reset cookie store mocks
    mockCookieStore.get.mockReset();
    mockCookieStore.set.mockReset();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  describe("makeServerLoginRequest", () => {
    const mockLoginResponse = {
      status: 200,
      data: {
        access: validToken,
        refresh: "mock-refresh-token",
      },
    };

    it("should successfully authenticate and set cookies", async () => {
      (axiosInstance.post as jest.Mock).mockResolvedValueOnce(
        mockLoginResponse,
      );

      const result = await makeServerLoginRequest("tds");

      expect(result).toEqual({ success: true });
      expect(axiosInstance.post).toHaveBeenCalledWith("/api/dj-auth/login/", {
        email: process.env.APP_TDS_USER_EMAIL,
        password: process.env.APP_TDS_USER_PASSWORD,
      });
      expect(mockCookieStore.set).toHaveBeenCalledTimes(3);
    });

    it("should throw error for missing credentials", async () => {
      process.env.APP_TDS_USER_EMAIL = undefined;
      process.env.APP_TDS_USER_PASSWORD = undefined;

      await expect(makeServerLoginRequest("tds")).rejects.toThrow(
        "Missing credentials for tds",
      );
    });

    it("should handle failed login attempts", async () => {
      const loginError = new Error("Login failed");

      (axiosInstance.post as jest.Mock).mockRejectedValueOnce(loginError);

      await expect(makeServerLoginRequest("tds")).rejects.toThrow(
        "Login failed",
      );
    });
  });

  describe("getServerTokens", () => {
    beforeEach(() => {
      // Ensure credentials exist
      process.env.APP_TDS_USER_EMAIL = "test@example.com";
      process.env.APP_TDS_USER_PASSWORD = "password123";

      // Reset axios mock
      (axiosInstance.post as jest.Mock).mockReset();

      (jwtDecode as jest.Mock).mockImplementation((token: string) => {
        if (token === validToken) return { exp: 9999999999 };

        return { exp: 1623456789 };
      });
    });

    it("should return existing valid tokens", async () => {
      mockCookieStore.get.mockImplementation((key: string) => ({
        value:
          key === "djAuthToken"
            ? validToken
            : key === "djRefreshToken"
              ? "refresh-token"
              : "tds",
      }));

      const result = await getServerTokens("tds");

      expect(result).toEqual({
        djAuthToken: validToken,
        djRefreshToken: "refresh-token",
        usedBackendUser: "tds",
      });
    });

    it("should request new tokens when current ones are expired", async () => {
      let callCount = 0;

      mockCookieStore.get.mockImplementation((key: string) => {
        callCount++;
        // First reads: expired token
        if (callCount <= 3) {
          if (key === "djAuthToken") return { value: expiredToken };
          if (key === "djRefreshToken") return { value: "refresh-token" };
          if (key === "usedBackendUser") return { value: "tds" };
        }
        // Subsequent reads: valid tokens after login
        if (key === "djAuthToken") return { value: validToken };
        if (key === "djRefreshToken") return { value: "new-refresh-token" };
        if (key === "usedBackendUser") return { value: "tds" };

        return { value: undefined };
      });

      (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: {
          access: validToken,
          refresh: "new-refresh-token",
        },
      });

      const result = await getServerTokens("tds");

      expect(result).not.toBeNull();
      expect(result?.djAuthToken).toBe(validToken);
      expect(axiosInstance.post).toHaveBeenCalled();
    });

    it("should request new tokens when backend user changes", async () => {
      let callCount = 0;

      mockCookieStore.get.mockImplementation((key: string) => {
        callCount++;
        // First reads: same auth token but with a different usedBackendUser
        if (callCount <= 3) {
          if (key === "djAuthToken") return { value: validToken };
          if (key === "djRefreshToken") return { value: "refresh-token" };
          if (key === "usedBackendUser") return { value: "cogeco" };
        }
        // After login, everything matches "tds"
        if (key === "djAuthToken") return { value: validToken };
        if (key === "djRefreshToken") return { value: "new-refresh-token" };
        if (key === "usedBackendUser") return { value: "tds" };

        return { value: undefined };
      });

      (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: {
          access: validToken,
          refresh: "new-refresh-token",
        },
      });

      const result = await getServerTokens("tds");

      expect(result).not.toBeNull();
      expect(result?.djAuthToken).toBe(validToken);
      expect(result?.usedBackendUser).toBe("tds");
      expect(axiosInstance.post).toHaveBeenCalled();
    });

    it("should return null when token retrieval fails", async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      (axiosInstance.post as jest.Mock).mockRejectedValueOnce(
        new Error("Network error"),
      );

      const result = await getServerTokens("tds");

      expect(result).toBeNull();
    });
  });
});
