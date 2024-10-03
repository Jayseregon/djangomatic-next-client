import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { TowerReportImage } from "@/src/types/reports";
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const site_images = data.site_images || [];
    const front_image = data.front_image || [];
    const deficiency_images = data.deficiency_images || [];

    // Create the report with nested images
    const newReport = await prisma.towerReport.create({
      data: {
        ...data,
        site_images: {
          create: site_images.map((image: TowerReportImage) => ({
            url: image.url,
            label: image.label,
            azureId: image.azureId,
          })),
        },
        front_image: {
          create: front_image.map((image: TowerReportImage) => ({
            url: image.url,
            label: image.label,
            azureId: image.azureId,
          })),
        },
        deficiency_images: {
          create: deficiency_images.map((image: TowerReportImage) => ({
            url: image.url,
            label: image.label,
            azureId: image.azureId,
          })),
        },
      },
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error(error);

    return new NextResponse("Error creating report", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("ID is required", { status: 400 });
  }

  try {
    const data = await request.json();
    const site_images = data.site_images || [];
    const front_image = data.front_image || [];
    const deficiency_images = data.deficiency_images || [];

    // Update the report
    const updatedReport = await prisma.towerReport.update({
      where: { id },
      data: {
        ...data,
        site_images: {
          deleteMany: {},
          create: site_images.map((image: TowerReportImage) => ({
            url: image.url,
            label: image.label,
            azureId: image.azureId,
          })),
        },
        front_image: {
          deleteMany: {},
          create: front_image.map((image: TowerReportImage) => ({
            url: image.url,
            label: image.label,
            azureId: image.azureId,
          })),
        },
        deficiency_images: {
          deleteMany: {},
          create: deficiency_images.map((image: TowerReportImage) => ({
            url: image.url,
            label: image.label,
            azureId: image.azureId,
          })),
        },
      },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error(error);

    return new NextResponse("Error updating report", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("ID is required", { status: 400 });
  }

  try {
    // Delete associated images from each category
    await prisma.towerReportImage.deleteMany({
      where: { siteProjectId: id },
    });

    await prisma.towerReportImage.deleteMany({
      where: { frontProjectId: id },
    });

    await prisma.towerReportImage.deleteMany({
      where: { deficiencyProjectId: id },
    });

    // Then delete the report
    await prisma.towerReport.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);

    return new NextResponse("Error deleting report", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function OPTIONS() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function PATCH() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
