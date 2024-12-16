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
      include: {
        projectCards: {
          include: {
            card: {
              include: {
                category: true, // Include the category relation
              },
            },
          },
        },
      },
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
    const { name, position } = data;

    const newProject = await prisma.roadmapProject.create({
      data: {
        name,
        position: position || 0,
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
    const data = await request.json();
    const { updates } = data;

    const result = await prisma.$transaction(
      updates.map(({ id, position }: { id: string; position: number }) =>
        prisma.roadmapProject.update({
          where: { id },
          data: { position },
        }),
      ),
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function OPTIONS() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
