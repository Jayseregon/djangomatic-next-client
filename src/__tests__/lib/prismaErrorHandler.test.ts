import { handlePrismaError } from "@/lib/prismaErrorHandler";

import { Prisma } from "../__mocks__/prisma-errors";
import { NextResponse } from "../__mocks__/next-server";

jest.mock("next/server", () => ({
  NextResponse: jest.requireActual("../__mocks__/next-server").NextResponse,
}));

jest.mock("@/generated/client", () => ({
  Prisma: {
    PrismaClientKnownRequestError: jest.requireActual(
      "../__mocks__/prisma-errors",
    ).PrismaClientKnownRequestError,
    PrismaClientValidationError: jest.requireActual(
      "../__mocks__/prisma-errors",
    ).PrismaClientValidationError,
  },
}));

describe("handlePrismaError", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should handle P2002 duplicate field error", () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "1.0.0",
        meta: { target: ["email"] },
      },
    );

    const response = handlePrismaError(error) as unknown as NextResponse;
    const data = JSON.parse(response._getData() as string);

    expect(response.status).toBe(409);
    expect(data.error).toBe('Duplicate field value: ["email"]');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Prisma Error:",
      "Unique constraint failed",
    );
  });

  it("should handle P2015 invalid foreign key error", () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Invalid foreign key",
      {
        code: "P2015",
        clientVersion: "1.0.0",
        meta: {},
      },
    );

    const response = handlePrismaError(error) as unknown as NextResponse;
    const data = JSON.parse(response._getData() as string);

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid foreign key reference.");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Prisma Error:",
      "Invalid foreign key",
    );
  });

  it("should handle P2025 record not found error", () => {
    const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
      code: "P2025",
      clientVersion: "1.0.0",
      meta: {},
    });

    const response = handlePrismaError(error) as unknown as NextResponse;
    const data = JSON.parse(response._getData() as string);

    expect(response.status).toBe(404);
    expect(data.error).toBe("Record not found.");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Prisma Error:",
      "Record not found",
    );
  });

  it("should handle unknown Prisma known errors", () => {
    const error = new Prisma.PrismaClientKnownRequestError("Unknown error", {
      code: "P9999",
      clientVersion: "1.0.0",
      meta: {},
    });

    const response = handlePrismaError(error) as unknown as NextResponse;
    const data = JSON.parse(response._getData() as string);

    expect(response.status).toBe(400);
    expect(data.error).toBe("Prisma Known Error: Unknown error");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Prisma Error:",
      "Unknown error",
    );
  });

  it("should handle validation errors", () => {
    const error = new Prisma.PrismaClientValidationError("Validation failed");

    const response = handlePrismaError(error) as unknown as NextResponse;
    const data = JSON.parse(response._getData() as string);

    expect(response.status).toBe(400);
    expect(data.error).toBe("Validation Error: Validation failed");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Prisma Error:",
      "Validation failed",
    );
  });

  it("should handle generic errors", () => {
    const error = new Error("Generic error");

    const response = handlePrismaError(error) as unknown as NextResponse;
    const data = JSON.parse(response._getData() as string);

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error: Generic error");
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error:", "Generic error");
  });

  it("should handle errors without message", () => {
    const error = {};

    const response = handlePrismaError(error) as unknown as NextResponse;
    const data = JSON.parse(response._getData() as string);

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error: Unknown error");
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error:", "Unknown error");
  });
});
