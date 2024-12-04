import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { handlePrismaError } from "@/src/lib/prismaErrorHandler";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("ID is required", { status: 400 });
  }

  try {
    const report = await prisma.towerReport.findUnique({
      where: { id },
      include: {
        site_images: true,
        front_image: true,
        deficiency_images: true,
        antenna_inventory: true,
        checklistForm4: true,
        checklistForm5: true,
        checklistForm6: true,
        checklistForm7: true,
        checklistForm8: true,
        checklistForm9: true,
        checklistForm10: true,
        checklistForm11: true,
        notes_antenna: true,
        notes_deficiency: true,
      },
    });

    if (!report) {
      return new NextResponse("Report not found", { status: 404 });
    }

    // console.log("Find unique report:", report);

    return NextResponse.json(report);
  } catch (error: any) {
    return handlePrismaError(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function PATCH() {
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
