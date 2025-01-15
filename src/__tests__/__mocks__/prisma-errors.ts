export class PrismaClientKnownRequestError extends Error {
  code: string;
  meta?: { target?: string[] };
  clientVersion: string;

  constructor(
    message: string,
    params: { code: string; clientVersion: string; meta?: any },
  ) {
    super(message);
    this.name = "PrismaClientKnownRequestError";
    this.code = params.code;
    this.clientVersion = params.clientVersion;
    this.meta = params.meta;
  }
}

export class PrismaClientValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PrismaClientValidationError";
  }
}

// Mock Prisma namespace
export const Prisma = {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
};

// Add test suite
describe("Prisma Error Mocks", () => {
  it("creates PrismaClientKnownRequestError with correct properties", () => {
    const error = new PrismaClientKnownRequestError("Test error", {
      code: "P2002",
      clientVersion: "1.0.0",
      meta: { target: ["email"] },
    });

    expect(error.name).toBe("PrismaClientKnownRequestError");
    expect(error.code).toBe("P2002");
    expect(error.message).toBe("Test error");
    expect(error.meta?.target).toEqual(["email"]);
  });

  it("creates PrismaClientValidationError with correct properties", () => {
    const error = new PrismaClientValidationError("Validation error");

    expect(error.name).toBe("PrismaClientValidationError");
    expect(error.message).toBe("Validation error");
  });
});
