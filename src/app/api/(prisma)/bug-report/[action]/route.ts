import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { handlePrismaError } from "@/lib/prismaErrorHandler";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Bug ID is required", { status: 400 });
  }

  try {
    const bug = await prisma.bugReport.findUnique({
      where: { id: id },
    });

    if (!bug) {
      return new NextResponse("Bug not found", { status: 404 });
    }

    // console.log("Found bug:", bug);

    return NextResponse.json(bug);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const newTask = await prisma.bugReport.create({
      data: data,
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

    // Destructure to exclude 'createdBy' from updateData
    const { id, createdBy: _createdBy, ...updateData } = data;

    // Prepare the update object
    const updateObject: any = {
      ...updateData,
    };

    // Remove fields that should not be directly updated
    delete updateObject.createdDate;
    delete updateObject.createdBy; // Ensure 'createdBy' is not updated

    // Change 'bugStatus' to 'status'
    if (updateObject.bugStatus) {
      updateObject.status = updateObject.bugStatus;
      delete updateObject.bugStatus;
    }

    const updatedTask = await prisma.bugReport.update({
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

    const _ = await prisma.bugReport.delete({
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
