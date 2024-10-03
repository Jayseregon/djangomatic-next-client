import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const reports = await prisma.towerReport.findMany({
      include: {
        site_images: true,
        front_image: true,
        deficiency_images: true,
      },
    });

    console.log("Find all reports:", reports);

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);

    return new NextResponse("Error fetching reports", { status: 500 });
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
