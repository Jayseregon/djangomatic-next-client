import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { handlePrismaError } from "@/lib/prismaErrorHandler";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Task ID is required", { status: 400 });
  }

  try {
    const task = await prisma.rnDTeamTask.findUnique({
      where: { id: id },
      include: { owner: true },
    });

    if (!task) {
      return new NextResponse("Task not found", { status: 404 });
    }

    // console.log("Found task:", task);

    return NextResponse.json(task);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { owner, ...taskData } = data;

    const newTask = await prisma.rnDTeamTask.create({
      data: {
        ...taskData,
        owner: {
          connect: { id: owner.id },
        },
      },
    });

    return NextResponse.json(newTask);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();

    // Destructure to exclude 'ownerId' from updateData
    const { id, owner, ownerId: _ownerId, ...updateData } = data;

    // Prepare the update object
    const updateObject: any = {
      ...updateData,
    };

    // Set up the owner relation
    if (owner && owner.id) {
      updateObject.owner = {
        connect: { id: owner.id },
      };
    }

    // Remove fields that should not be directly updated
    delete updateObject.createdAt;

    const updatedTask = await prisma.rnDTeamTask.update({
      where: { id },
      data: updateObject,
    });

    return NextResponse.json(updatedTask);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    const _ = await prisma.rnDTeamTask.delete({
      where: { id },
    });

    return new NextResponse("Task deleted", { status: 200 });
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function OPTIONS() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function PATCH() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
