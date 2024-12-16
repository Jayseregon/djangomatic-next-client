import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { handlePrismaError } from "@/src/lib/prismaErrorHandler";

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  try {
    const { updates } = await request.json();

    if (!updates || !Array.isArray(updates)) {
      return new NextResponse("Invalid updates format", { status: 400 });
    }

    // Validate updates array
    const validUpdates = updates.every(
      (update) =>
        update.projectId &&
        update.cardId &&
        typeof update.position === "number",
    );

    if (!validUpdates) {
      return new NextResponse("Missing required fields in updates", {
        status: 400,
      });
    }

    // Perform all updates in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updatePromises = updates.map(({ projectId, cardId, position }) =>
        tx.roadmapProjectCard.update({
          where: {
            projectId_cardId: { projectId, cardId },
          },
          data: { position },
          include: {
            card: true,
            project: true,
          },
        }),
      );

      const results = await Promise.all(updatePromises);

      return results;
    });

    if (!result || result.length === 0) {
      return new NextResponse("Failed to update positions", { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Detailed error:", error);

    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function OPTIONS() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
