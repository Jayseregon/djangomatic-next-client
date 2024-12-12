import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { handlePrismaError } from "@/src/lib/prismaErrorHandler";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Project ID is required", { status: 400 });
  }

  try {
    const project = await prisma.roadmapProject.findUnique({
      where: { id },
      include: { cards: true },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name } = data;

    // Get the current max position
    const maxPosition = await prisma.roadmapProject.aggregate({
      _max: {
        position: true,
      },
    });

    const newPosition = (maxPosition._max.position ?? 0) + 1;

    const newProject = await prisma.roadmapProject.create({
      data: { 
        name,
        position: newPosition
      },
    });

    return NextResponse.json(newProject);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: Request) {
  try {
    const { updates } = await request.json();

    const result = await prisma.$transaction(
      updates.map(({ id, position }: { id: string; position: number }) =>
        prisma.roadmapProject.update({
          where: { id },
          data: { position },
        })
      )
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}
