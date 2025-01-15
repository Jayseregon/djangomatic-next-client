// Constants
const NEW_CSRF_TOKEN = "new-csrf-token";

// Create a mock middleware function that we can track
const mockMiddlewareFunction = jest.fn().mockImplementation(() =>
  Promise.resolve({
    headers: new Headers({ "X-CSRF-Token": NEW_CSRF_TOKEN }),
    status: 200,
  }),
);

// Mock modules first
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
  headers: jest.fn(),
}));

jest.mock("@edge-csrf/nextjs", () => ({
  createCsrfMiddleware: () => () => mockMiddlewareFunction(),
}));

// Imports after mocks
import { cookies } from "next/headers";

import { getServerCsrfToken } from "@/actions/generic/action";

describe("getServerCsrfToken", () => {
  const mockConsoleError = jest.fn();

  console.error = mockConsoleError;

  const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  };

  const mockCookieStore = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);
    mockConsoleError.mockClear();
    mockMiddlewareFunction.mockClear();

    // Reset default middleware behavior
    mockMiddlewareFunction.mockImplementation(() =>
      Promise.resolve({
        headers: new Headers({ "X-CSRF-Token": NEW_CSRF_TOKEN }),
        status: 200,
      }),
    );

    process.env = {
      ...process.env,
      NODE_ENV: "development",
      NEXT_PUBLIC_BASE_URL: "http://localhost:3000",
    };
  });

  it("should return existing token if found in cookies", async () => {
    const existingToken = "existing-csrf-token";

    mockCookieStore.get.mockReturnValue({ value: existingToken });

    const result = await getServerCsrfToken();

    expect(result).toBe(existingToken);
    expect(mockCookieStore.get).toHaveBeenCalledWith("csrf-token");
    expect(mockMiddlewareFunction).not.toHaveBeenCalled();
  });

  it("should generate new token if none exists in cookies", async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    const result = await getServerCsrfToken();

    expect(result).toBe(NEW_CSRF_TOKEN);
    expect(mockCookieStore.get).toHaveBeenCalledWith("csrf-token");
    expect(mockMiddlewareFunction).toHaveBeenCalled();
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "csrf-token",
      NEW_CSRF_TOKEN,
      COOKIE_OPTIONS,
    );
  });

  it('should handle middleware failure and return "missing"', async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    mockMiddlewareFunction.mockImplementationOnce(() =>
      Promise.resolve({
        headers: new Headers(),
        status: 200,
      }),
    );

    const result = await getServerCsrfToken();

    expect(result).toBe("missing");
    expect(mockCookieStore.get).toHaveBeenCalledWith("csrf-token");
    expect(mockMiddlewareFunction).toHaveBeenCalled();
  });

  it('should handle errors and return "missing"', async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    mockMiddlewareFunction.mockRejectedValueOnce(new Error("Middleware error"));

    const result = await getServerCsrfToken();

    expect(result).toBe("missing");
    expect(mockConsoleError).toHaveBeenCalledWith(
      "CSRF token retrieval/generation failed:",
      expect.any(String),
    );
  });

  it("should use correct environment settings for production", async () => {
    const originalEnv = process.env;

    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_BASE_URL: "https://example.com",
      NODE_ENV: "production",
    };

    mockCookieStore.get.mockReturnValue(undefined);

    const result = await getServerCsrfToken();

    expect(result).toBe(NEW_CSRF_TOKEN);
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "csrf-token",
      NEW_CSRF_TOKEN,
      {
        ...COOKIE_OPTIONS,
        secure: true,
      },
    );

    process.env = originalEnv;
  });
});
