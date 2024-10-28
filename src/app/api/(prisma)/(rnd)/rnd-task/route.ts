import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get("id");

  if (!ownerId) {
    return new NextResponse("ownerId is required", { status: 400 });
  }

  try {
    const tasks = await prisma.rnDTeamTask.findMany({
      where: { ownerId: ownerId },
      include: { owner: true },
    });

    if (!tasks) {
      return new NextResponse("Tasks not found", { status: 404 });
    }

    console.log("Found tasks:", tasks);

    return NextResponse.json(tasks);
  } catch (error) {
    return new NextResponse("Error fetching tasks", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST() {
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

export async function PATCH() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
