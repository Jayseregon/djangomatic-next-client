import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prismaClient";
import { superUserEmails } from "@/config/superUser";
import { auth } from "@/auth";
import { handlePrismaError } from "@/src/lib/prismaErrorHandler";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: Request) {
  const { id, ...updates } = await request.json();

  if (!id) {
    return new NextResponse("User ID is required", { status: 400 });
  }

  // Get the authenticated user's email
  const session = await auth();
  const sessionEmail = session?.user.email;

  if (!sessionEmail) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const isSessionSuperUser = superUserEmails.includes(sessionEmail);

  // Get the email of the user being updated
  const userToUpdate = await prisma.user.findUnique({
    where: { id },
    select: { email: true },
  });

  const isUserSuperUser = superUserEmails.includes(userToUpdate?.email || "");

  // If the session user is not a superuser and is trying to update a superuser, deny the request
  if (!isSessionSuperUser && isUserSuperUser) {
    return new NextResponse("You are not allowed to modify this user", {
      status: 403,
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function PUT() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function DELETE() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function OPTIONS() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
