import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export const handlePrismaError = (error: any): NextResponse => {
  console.error("Prisma Error:", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return new NextResponse(
          "Duplicate field value: " + JSON.stringify(error.meta?.target),
          { status: 409 },
        );
      case "P2015":
        return new NextResponse("Invalid foreign key reference.", {
          status: 400,
        });
      case "P2025":
        return new NextResponse("Record not found.", { status: 404 });
      // Add more cases as needed
      default:
        return new NextResponse("Prisma Known Error: " + error.message, {
          status: 400,
        });
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    return new NextResponse("Validation Error: " + error.message, {
      status: 400,
    });
  }

  // Default to 500 status for unhandled errors
  return new NextResponse("Internal Server Error", { status: 500 });
};
