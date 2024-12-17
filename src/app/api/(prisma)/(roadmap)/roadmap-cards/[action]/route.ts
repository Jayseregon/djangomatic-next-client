import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { handlePrismaError } from "@/src/lib/prismaErrorHandler";

const prisma = new PrismaClient();

// TODDO - Remove methods and create server actions

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Card ID is required", { status: 400 });
  }

  try {
    const card = await prisma.roadmapCard.findUnique({
      where: { id },
      // include: { projects: true, category: true },
      include: {
        projectCards: {
          include: {
            project: true,
          },
        },
        category: true,
      },
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
    const { id, projectId, categoryId, position, ...updateData } = data;

    const updateOps: any = {
      ...updateData,
    };

    if (categoryId !== undefined) {
      updateOps.category = categoryId
        ? { connect: { id: categoryId } }
        : { disconnect: true };
      updateOps.position = position;
    }

    // Handle project assignment with upsert
    if (projectId) {
      // First, update the card's basic info
      const updatedCard = await prisma.roadmapCard.update({
        where: { id },
        data: updateOps,
        include: {
          category: true,
          projectCards: {
            include: {
              project: true,
            },
          },
        },
      });

      // Then, handle the project card relationship separately
      await prisma.roadmapProjectCard.upsert({
        where: {
          projectId_cardId: {
            projectId,
            cardId: id,
          },
        },
        create: {
          projectId,
          cardId: id,
          position: 0,
        },
        update: {}, // No updates needed if it exists
      });

      return NextResponse.json(updatedCard);
    }

    // If no project assignment, just update the card
    const updatedCard = await prisma.roadmapCard.update({
      where: { id },
      data: updateOps,
      include: {
        category: true,
        projectCards: {
          include: {
            project: true,
          },
        },
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
