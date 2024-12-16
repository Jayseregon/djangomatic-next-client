import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { handlePrismaError } from "@/src/lib/prismaErrorHandler";

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  try {
    const { updates } = await request.json();

    const result = await prisma.$transaction(
      updates.map(
        ({
          projectId,
          cardId,
          position,
        }: {
          projectId: string;
          cardId: string;
          position: number;
        }) =>
          prisma.roadmapProjectCard.update({
            where: {
              // Use the unique constraint name as per Prisma client
              projectId_cardId: {
                projectId,
                cardId,
              },
            },
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
