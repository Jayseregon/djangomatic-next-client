// Constants for tests
const NEW_CSRF_TOKEN = "new-csrf-token";

// Mock modules first without external variables
jest.mock("@prisma/client", () => {
  const mock = {
    findUnique: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => ({
      user: mock,
    })),
    _mock: mock,
  };
});

// Create CSRF middleware mock
const mockMiddlewareResponse = jest.fn().mockImplementation(() =>
  Promise.resolve({
    headers: new Headers({ "X-CSRF-Token": NEW_CSRF_TOKEN }),
    status: 200,
  }),
);

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

jest.mock("@edge-csrf/nextjs", () => ({
  createCsrfMiddleware: () => () => mockMiddlewareResponse(),
}));

// Imports after mocks
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

import { fetchUserServer, getServerCsrfToken } from "@/actions/generic/action";

// Get the mock from the Prisma mock
const prismaUserMock = (PrismaClient as any)()?.user;

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
    mockMiddlewareResponse.mockClear();
  });

  it("should return existing token if found in cookies", async () => {
    const existingToken = "existing-csrf-token";

    mockCookieStore.get.mockReturnValue({ value: existingToken });

    const result = await getServerCsrfToken();

    expect(result).toBe(existingToken);
    expect(mockCookieStore.get).toHaveBeenCalledWith("csrf-token");
    expect(mockMiddlewareResponse).not.toHaveBeenCalled();
  });

  it("should generate new token if none exists in cookies", async () => {
    mockCookieStore.get.mockReturnValue(undefined);

    const result = await getServerCsrfToken();

    expect(result).toBe(NEW_CSRF_TOKEN);
    expect(mockCookieStore.get).toHaveBeenCalledWith("csrf-token");
    expect(mockMiddlewareResponse).toHaveBeenCalled();
    expect(mockCookieStore.set).toHaveBeenCalledWith(
      "csrf-token",
      NEW_CSRF_TOKEN,
      COOKIE_OPTIONS,
    );
  });

  it('should handle middleware failure and return "missing"', async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    mockMiddlewareResponse.mockImplementationOnce(() =>
      Promise.resolve({
        headers: new Headers(),
        status: 200,
      }),
    );

    const result = await getServerCsrfToken();

    expect(result).toBe("missing");
    expect(mockCookieStore.get).toHaveBeenCalledWith("csrf-token");
    expect(mockMiddlewareResponse).toHaveBeenCalled();
  });

  it('should handle errors and return "missing"', async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    mockMiddlewareResponse.mockRejectedValueOnce(new Error("Middleware error"));

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

describe("fetchUserServer", () => {
  const mockUser = {
    id: "test-id",
    email: "test@example.com",
    name: "Test User",
    createdAt: new Date("2025-01-15T15:40:03.192Z"),
    lastLogin: new Date("2025-01-15T15:40:03.192Z"),
    isAdmin: false,
    isRnDTeam: false,
    canAccessAppsTdsHLD: false,
    canAccessAppsTdsLLD: false,
    canAccessVideoSttar: false,
    // ...all other required fields
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaUserMock.findUnique.mockReset();
  });

  it("should return user with empty rndTasks array when user is found", async () => {
    prismaUserMock.findUnique.mockResolvedValue(mockUser);

    const result = await fetchUserServer("test@example.com");

    expect(result).toEqual({ ...mockUser, rndTasks: [] });
    expect(prismaUserMock.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
  });

  it("should return null when user is not found", async () => {
    prismaUserMock.findUnique.mockResolvedValue(null);

    const result = await fetchUserServer("nonexistent@example.com");

    expect(result).toBeNull();
    expect(prismaUserMock.findUnique).toHaveBeenCalledWith({
      where: { email: "nonexistent@example.com" },
    });
  });

  it("should return null and log error when database query fails", async () => {
    const mockError = new Error("Database error");

    prismaUserMock.findUnique.mockRejectedValue(mockError);
    const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

    const result = await fetchUserServer("test@example.com");

    expect(result).toBeNull();
    expect(mockConsoleError).toHaveBeenCalledWith(
      "Failed to fetch user:",
      mockError,
    );
    mockConsoleError.mockRestore();
  });

  it("should validate email with zod", async () => {
    prismaUserMock.findUnique.mockResolvedValueOnce(mockUser);

    await fetchUserServer("test@example.com");

    expect(prismaUserMock.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
  });
});
