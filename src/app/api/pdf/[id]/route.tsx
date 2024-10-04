import { PrismaClient } from "@prisma/client";
import React from "react";
import { Page, Document, Font, renderToStream } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

import { titleCase } from "@/src/lib/utils";
import { StylesPDF } from "@/styles/stylesPDF";
import { TowerReport, TOCSections } from "@/src/types/reports";
import FrontPage from "@/src/components/reports/pdfBlocks/rogers/FrontPage";
import AuthorPage from "@/src/components/reports/pdfBlocks/rogers/AuthorPage";
import TableOfContentsPage from "@/src/components/reports/pdfBlocks/rogers/TableOfContentsPage";
import ScopeOfWorkPage from "@/src/components/reports/pdfBlocks/rogers/ScopeOfWorkPage";
import AntennaInventoryPage from "@/src/components/reports/pdfBlocks/rogers/AntennaInventoryPage";
import DeficienciesPage from "@/src/components/reports/pdfBlocks/rogers/DeficienciesPage";
import SitePhotosPage from "@/src/components/reports/pdfBlocks/rogers/SitePhotosPage";
import PageFooter from "@/src/components/reports/pdfBlocks/rogers/PageFooter";
import AppendixA from "@/src/components/reports/pdfBlocks/rogers/AppendixA";
import AppendixB from "@/src/components/reports/pdfBlocks/rogers/AppendixB";
import AppendixC from "@/src/components/reports/pdfBlocks/rogers/AppendixC";

const prisma = new PrismaClient();

// disable hyphenation
Font.registerHyphenationCallback((word) => [word]);

// Create Report Document Component
const ReportDocument = ({
  report,
  tocSections,
  willCaptureToc,
}: {
  report: TowerReport;
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) => {
  return (
    <Document>
      {/* Front cover page */}
      <FrontPage report={report} />

      {/* New page document corpus */}
      <Page size="LETTER" style={StylesPDF.page}>
        {/* New page Author */}
        <AuthorPage report={report} />

        {/* New page TOC */}
        <TableOfContentsPage tocSections={tocSections} />

        {/* New page SOW */}
        <ScopeOfWorkPage
          report={report}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        />

        {/* New page Antenna & Transmission Line Inventory */}
        {report.antenna_inventory.length > 0 && (
          <AntennaInventoryPage
            antennaInventory={report.antenna_inventory}
            tocSections={tocSections}
            willCaptureToc={willCaptureToc}
          />
        )}

        {/* New page DEFICIENCIES (if exists) */}
        {report.deficiency_images.length > 0 && (
          <DeficienciesPage
            report={report}
            tocSections={tocSections}
            willCaptureToc={willCaptureToc}
          />
        )}

        {/* New page SITE PHOTOS */}
        {report.site_images.length > 0 && (
          <SitePhotosPage
            report={report}
            tocSections={tocSections}
            willCaptureToc={willCaptureToc}
          />
        )}

        {/* Page Footer */}
        <PageFooter />
      </Page>

      {/* New page for Appendices */}
      <Page size="LETTER" style={StylesPDF.page}>
        {/* New page Appendix A */}
        <AppendixA tocSections={tocSections} willCaptureToc={willCaptureToc} />

        {/* New page Appendix B */}
        <AppendixB tocSections={tocSections} willCaptureToc={willCaptureToc} />

        {/* New page Appendix C */}
        <AppendixC tocSections={tocSections} willCaptureToc={willCaptureToc} />

        {/* Page Footer */}
        <PageFooter />
      </Page>
    </Document>
  );
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
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
    },
  });

  if (!report) {
    return new Response("Report not found", { status: 404 });
  }

  const tocSections: TOCSections[] = [];

  await renderToStream(
    <ReportDocument
      report={report}
      tocSections={tocSections}
      willCaptureToc={true}
    />,
  );

  const stream = await renderToStream(
    <ReportDocument
      report={report}
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
