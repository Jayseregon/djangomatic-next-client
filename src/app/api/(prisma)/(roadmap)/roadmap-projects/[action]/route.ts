import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prismaClient";
import { handlePrismaError } from "@/src/lib/prismaErrorHandler";

// TODO - Remove GET method and create server action
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

// TODO - Remove PATCH method and create server action
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

// TODO - Remove PUT method and create server action
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...fields } = data;

    if (!id) {
      return new NextResponse("Project ID is required", { status: 400 });
    }

    const updatedProject = await prisma.roadmapProject.update({
      where: { id },
      data: fields,
    });

    return NextResponse.json(updatedProject);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}
