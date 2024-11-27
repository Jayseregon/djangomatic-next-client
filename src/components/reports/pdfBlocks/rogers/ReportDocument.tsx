import React from "react";
import { Page, Document } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TowerReport, TOCSections } from "@/types/reports";
import FrontPage from "@/components/reports/pdfBlocks/rogers/FrontPage";
import AuthorPage from "@/components/reports/pdfBlocks/rogers/AuthorPage";
import TableOfContentsPage from "@/components/reports/pdfBlocks/rogers/TableOfContentsPage";
import ScopeOfWorkPage from "@/components/reports/pdfBlocks/rogers/ScopeOfWorkPage";
import AntennaInventoryPage from "@/components/reports/pdfBlocks/rogers/AntennaInventoryPage";
import DeficienciesPage from "@/components/reports/pdfBlocks/rogers/DeficienciesPage";
import SitePhotosPage from "@/components/reports/pdfBlocks/rogers/SitePhotosPage";
import PageFooter from "@/components/reports/pdfBlocks/rogers/PageFooter";
import AppendixA from "@/components/reports/pdfBlocks/rogers/AppendixA";
import AppendixB from "@/components/reports/pdfBlocks/rogers/AppendixB";

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
        <PageFooter redlinePages={report.redline_pages} />
      </Page>

      {/* New page for Appendices */}
      <Page size="LETTER" style={StylesPDF.page}>
        {/* Isolate Appendix A for readline page count */}
        <AppendixA tocSections={tocSections} willCaptureToc={willCaptureToc} />
        {/* Page Footer */}
        <PageFooter redlinePages={report.redline_pages} />
      </Page>
      {/* New page for Appendices */}
      <Page size="LETTER" style={StylesPDF.page}>
        {/* New page Appendix B */}
        <AppendixB
          redlinePages={report.redline_pages}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        />
        {/* New page Appendix C */}
        {/* <AppendixC
            report={report}
            tocSections={tocSections}
            willCaptureToc={willCaptureToc}
          /> */}
        {/* Page Footer */}
        <PageFooter jumpRedlines redlinePages={report.redline_pages} />
      </Page>
    </Document>
  );
};

export default ReportDocument;
