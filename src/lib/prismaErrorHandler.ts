import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export const handlePrismaError = (error: any): NextResponse => {
  const message = error?.message || "Unknown error";
  const isPrismaError =
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError;

  console.error(isPrismaError ? "Prisma Error:" : "Error:", message);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return NextResponse.json(
          {
            error:
              "Duplicate field value: " + JSON.stringify(error.meta?.target),
          },
          { status: 409 },
        );
      case "P2015":
        return NextResponse.json(
          { error: "Invalid foreign key reference." },
          { status: 400 },
        );
      case "P2025":
        return NextResponse.json(
          { error: "Record not found." },
          { status: 404 },
        );
      // Add more cases as needed
      default:
        return NextResponse.json(
          { error: "Prisma Known Error: " + message },
          { status: 400 },
        );
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      { error: "Validation Error: " + message },
      { status: 400 },
    );
  }

  // Default to 500 status for unhandled errors
  return NextResponse.json(
    { error: "Internal Server Error: " + message },
    { status: 500 },
  );
};
