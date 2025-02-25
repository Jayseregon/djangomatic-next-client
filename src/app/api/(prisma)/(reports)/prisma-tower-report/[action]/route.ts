import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import {
  TowerReportImage,
  AntennaTransmissionLine,
  ChecklistRow,
  Note,
} from "@/src/interfaces/reports";
import { handlePrismaError } from "@/src/lib/prismaErrorHandler";
const prisma = new PrismaClient();

const createNestedData = (data: any) => {
  const site_images = data.site_images || [];
  const front_image = data.front_image || [];
  const deficiency_images = data.deficiency_images || [];
  const antenna_inventory = data.antenna_inventory || [];
  const checklistForm4 = data.checklistForm4 || [];
  const checklistForm5 = data.checklistForm5 || [];
  const checklistForm6 = data.checklistForm6 || [];
  const checklistForm7 = data.checklistForm7 || [];
  const checklistForm8 = data.checklistForm8 || [];
  const checklistForm9 = data.checklistForm9 || [];
  const checklistForm10 = data.checklistForm10 || [];
  const checklistForm11 = data.checklistForm11 || [];
  const notes_antenna = data.notes_antenna || [];
  const notes_deficiency = data.notes_deficiency || [];

  return {
    ...data,
    antenna_inventory: {
      create: antenna_inventory.map((antenna: AntennaTransmissionLine) => ({
        elevation: antenna.elevation,
        quantity: antenna.quantity,
        equipment: antenna.equipment,
        azimuth: antenna.azimuth,
        tx_line: antenna.tx_line,
        odu: antenna.odu,
        carrier: antenna.carrier,
      })),
    },
    site_images: {
      create: site_images.map((image: TowerReportImage) => ({
        url: image.url,
        label: image.label,
        azureId: image.azureId,
        imgIndex: image.imgIndex,
        deficiency_check_procedure: image.deficiency_check_procedure,
        deficiency_recommendation: image.deficiency_recommendation,
      })),
    },
    front_image: {
      create: front_image.map((image: TowerReportImage) => ({
        url: image.url,
        label: image.label,
        azureId: image.azureId,
        imgIndex: image.imgIndex,
        deficiency_check_procedure: image.deficiency_check_procedure,
        deficiency_recommendation: image.deficiency_recommendation,
      })),
    },
    deficiency_images: {
      create: deficiency_images.map((image: TowerReportImage) => ({
        url: image.url,
        label: image.label,
        azureId: image.azureId,
        imgIndex: image.imgIndex,
        deficiency_check_procedure: image.deficiency_check_procedure,
        deficiency_recommendation: image.deficiency_recommendation,
      })),
    },
    checklistForm4: {
      create: checklistForm4.map((checklist: ChecklistRow) => ({
        code: checklist.code,
        isChecked: checklist.isChecked,
        comments: checklist.comments,
      })),
    },
    checklistForm5: {
      create: checklistForm5.map((checklist: ChecklistRow) => ({
        code: checklist.code,
        isChecked: checklist.isChecked,
        comments: checklist.comments,
      })),
    },
    checklistForm6: {
      create: checklistForm6.map((checklist: ChecklistRow) => ({
        code: checklist.code,
        isChecked: checklist.isChecked,
        comments: checklist.comments,
      })),
    },
    checklistForm7: {
      create: checklistForm7.map((checklist: ChecklistRow) => ({
        code: checklist.code,
        isChecked: checklist.isChecked,
        comments: checklist.comments,
      })),
    },
    checklistForm8: {
      create: checklistForm8.map((checklist: ChecklistRow) => ({
        code: checklist.code,
        isChecked: checklist.isChecked,
        comments: checklist.comments,
      })),
    },
    checklistForm9: {
      create: checklistForm9.map((checklist: ChecklistRow) => ({
        code: checklist.code,
        isChecked: checklist.isChecked,
        comments: checklist.comments,
      })),
    },
    checklistForm10: {
      create: checklistForm10.map((checklist: ChecklistRow) => ({
        code: checklist.code,
        isChecked: checklist.isChecked,
        comments: checklist.comments,
      })),
    },
    checklistForm11: {
      create: checklistForm11.map((checklist: ChecklistRow) => ({
        code: checklist.code,
        isChecked: checklist.isChecked,
        comments: checklist.comments,
      })),
    },
    notes_antenna: {
      create: notes_antenna.map((note: Note) => ({
        indexNumber: parseInt(note.indexNumber as any) || 0,
        comment: note.comment || "",
      })),
    },
    notes_deficiency: {
      create: notes_deficiency.map((note: Note) => ({
        indexNumber: parseInt(note.indexNumber as any) || 0,
        comment: note.comment || "",
      })),
    },
  };
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const nestedData = createNestedData(data);

    const newReport = await prisma.towerReport.create({
      data: nestedData,
    });

    return NextResponse.json({ report: newReport }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to create report",
          details: error.message,
        },
        { status: 500 },
      );
    } else {
      return handlePrismaError(error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const data = await request.json();
    const nestedData = createNestedData(data);

    const updatedReport = await prisma.towerReport.update({
      where: { id },
      data: {
        ...nestedData,
        antenna_inventory: {
          deleteMany: {},
          create: nestedData.antenna_inventory.create,
        },
        site_images: {
          deleteMany: {},
          create: nestedData.site_images.create,
        },
        front_image: {
          deleteMany: {},
          create: nestedData.front_image.create,
        },
        deficiency_images: {
          deleteMany: {},
          create: nestedData.deficiency_images.create,
        },
        checklistForm4: {
          deleteMany: {},
          create: nestedData.checklistForm4.create,
        },
        checklistForm5: {
          deleteMany: {},
          create: nestedData.checklistForm5.create,
        },
        checklistForm6: {
          deleteMany: {},
          create: nestedData.checklistForm6.create,
        },
        checklistForm7: {
          deleteMany: {},
          create: nestedData.checklistForm7.create,
        },
        checklistForm8: {
          deleteMany: {},
          create: nestedData.checklistForm8.create,
        },
        checklistForm9: {
          deleteMany: {},
          create: nestedData.checklistForm9.create,
        },
        checklistForm10: {
          deleteMany: {},
          create: nestedData.checklistForm10.create,
        },
        checklistForm11: {
          deleteMany: {},
          create: nestedData.checklistForm11.create,
        },
        notes_antenna: {
          deleteMany: {},
          create: nestedData.notes_antenna.create,
        },
        notes_deficiency: {
          deleteMany: {},
          create: nestedData.notes_deficiency.create,
        },
      },
    });

    return NextResponse.json({ report: updatedReport }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      const detailedError = `Error updating report with id ${id}: ${error.message}. Stack trace: ${error.stack}`;

      // Return comprehensive details to the client so it gets logged in the browser
      return NextResponse.json(
        {
          error: "Failed to update report",
          details: detailedError,
        },
        { status: 500 },
      );
    }

    return handlePrismaError(error);
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
    // Delete associated notes first
    await prisma.note.deleteMany({
      where: {
        OR: [{ towerReportAntennaId: id }, { towerReportDeficiencyId: id }],
      },
    });

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

    await prisma.antennaTransmissionLine.deleteMany({
      where: { projectId: id },
    });

    await prisma.checklistRow.deleteMany({
      where: {
        OR: [
          { form4Id: id },
          { form5Id: id },
          { form6Id: id },
          { form7Id: id },
          { form8Id: id },
          { form9Id: id },
          { form10Id: id },
          { form11Id: id },
        ],
      },
    });

    // Then delete the report
    await prisma.towerReport.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return handlePrismaError(error);
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
