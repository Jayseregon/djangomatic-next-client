import { PrismaClient } from "@prisma/client";
import React from "react";
import { Font, renderToStream } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

import { titleCase } from "@/src/lib/utils";
import { TOCSections } from "@/src/types/reports";
import ReportDocument from "@/src/components/reports/pdfBlocks/rogers/ReportDocument";

const prisma = new PrismaClient();

// disable hyphenation
Font.registerHyphenationCallback((word) => [word]);

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;

  if (!params.id || params.id === "new") {
    return new Response("ID is required", { status: 400 });
  }

  const report = await prisma.towerReport.findUnique({
    where: { id: params.id },
    include: {
      front_image: true,
      site_images: true,
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
    return new Response("Report not found", { status: 404 });
  }

  // Transform the checklist forms to ensure isChecked is boolean | undefined >> prisma boolean? type defaults to null
  const transformChecklistForm = (form: any[]) =>
    form.map((item) => ({
      ...item,
      isChecked: item.isChecked === null ? undefined : item.isChecked,
    }));

  const transformedReport = {
    ...report,
    // Ensure date fields are properly converted
    createdAt: new Date(report.createdAt),
    updatedAt: new Date(report.updatedAt),
    // Transform checklist forms
    checklistForm4: transformChecklistForm(report.checklistForm4),
    checklistForm5: transformChecklistForm(report.checklistForm5),
    checklistForm6: transformChecklistForm(report.checklistForm6),
    checklistForm7: transformChecklistForm(report.checklistForm7),
    checklistForm8: transformChecklistForm(report.checklistForm8),
    checklistForm9: transformChecklistForm(report.checklistForm9),
    checklistForm10: transformChecklistForm(report.checklistForm10),
    checklistForm11: transformChecklistForm(report.checklistForm11),
  };

  const tocSections: TOCSections[] = [];

  await renderToStream(
    <ReportDocument
      report={transformedReport}
      tocSections={tocSections}
      willCaptureToc={true}
    />,
  );

  const stream = await renderToStream(
    <ReportDocument
      report={transformedReport}
      tocSections={tocSections}
      willCaptureToc={false}
    />,
  );

  // console.log("TOC af: ", tocSections);

  const response = new NextResponse(stream as unknown as ReadableStream);

  response.headers.set("Content-Type", "application/pdf");
  response.headers.set(
    "Content-Disposition",
    `inline; filename="${report.site_code}-${titleCase(
      report.tower_site_name,
    )}-${report.site_region}-${report.jde_job}-PCI.pdf"`,
  );

  // response.headers.set(
  //   "Content-Disposition",
  //   `attachment; filename="${report.site_code}-${titleCase(
  //     report.tower_site_name
  //   )}-${report.site_region}-${report.jde_job}-PCI.pdf"`
  // );

  return response;
}
