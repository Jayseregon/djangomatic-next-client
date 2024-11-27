import React from "react";
import { Page, Document } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TowerReport, TOCSections } from "@/types/reports";

import FrontPage from "./FrontPage";
import AuthorPage from "./AuthorPage";
import TableOfContentsPage from "./TableOfContentsPage";
import ScopeOfWorkPage from "./ScopeOfWorkPage";
import AntennaInventoryPage from "./AntennaInventoryPage";
import DeficienciesPage from "./DeficienciesPage";
import SitePhotosPage from "./SitePhotosPage";
import PageFooter from "./PageFooter";
import AppendixA from "./AppendixA";
import AppendixB from "./AppendixB";
import AppendixC from "./AppendixC";

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
        <PageFooter redlinePages={report.redline_pages} />
      </Page>

      {/* New page DEFICIENCIES (if exists) */}
      {report.deficiency_images.length > 0 && (
        <DeficienciesPage
          report={report}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        />
      )}

      {/* New page SITE PHOTOS (if exists) */}
      {report.site_images.length > 0 && (
        <SitePhotosPage
          report={report}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        />
      )}

      {/* New section for Appendices */}
      <AppendixA
        redlinePages={report.redline_pages}
        tocSections={tocSections}
        willCaptureToc={willCaptureToc}
      />
      <AppendixB
        redlinePages={report.redline_pages}
        tocSections={tocSections}
        willCaptureToc={willCaptureToc}
      />
      <AppendixC
        report={report}
        tocSections={tocSections}
        willCaptureToc={willCaptureToc}
      />
    </Document>
  );
};

export default ReportDocument;
