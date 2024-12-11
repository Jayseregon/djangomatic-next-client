import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { handlePrismaError } from "@/src/lib/prismaErrorHandler";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Card ID is required", { status: 400 });
  }

  try {
    const card = await prisma.roadmapCard.findUnique({
      where: { id },
      include: { projects: true },
    });

    return NextResponse.json(card);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, description, color } = data;

    // Get the current max position
    const maxPosition = await prisma.roadmapCard.aggregate({
      _max: {
        position: true,
      },
    });

    const newPosition = (maxPosition._max.position ?? 0) + 1;

    const newCard = await prisma.roadmapCard.create({
      data: {
        title,
        description,
        color,
        position: newPosition,
      },
    });

    return NextResponse.json(newCard);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, projectId, ...updateData } = data;

    const updatedCard = await prisma.roadmapCard.update({
      where: { id },
      data: {
        ...updateData,
        projects: projectId
          ? {
              connect: [{ id: projectId }],
            }
          : undefined,
      },
      include: {
        projects: true,
      },
    });

    return NextResponse.json(updatedCard);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await prisma.roadmapCard.delete({ where: { id } });

    return new NextResponse("Card deleted", { status: 200 });
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: Request) {
  try {
    const { updates } = await request.json();

    // Use transaction to ensure all position updates succeed or none do
    const result = await prisma.$transaction(
      updates.map(({ id, position }: { id: string; position: number }) =>
        prisma.roadmapCard.update({
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
