import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image as PdfImg,
} from "@react-pdf/renderer";

import { TOCSections, TowerReport } from "@/src/types/reports";
import { StylesPDF } from "@/styles/stylesPDF";

// Import your page components
import FrontPage from "./FrontPage";
import AuthorPage from "./AuthorPage";
import TableOfContentsPage from "./TableOfContentsPage";
import ScopeOfWorkPage from "./ScopeOfWorkPage";
import AntennaInventoryPage from "./AntennaInventoryPage";
import DeficienciesPage from "./DeficienciesPage";
import SitePhotosPage from "./SitePhotosPage";
// Reactivate the Appendices
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
  // Collect all pages into an array
  const pages = [
    <FrontPage report={report} />,
    <AuthorPage report={report} />,
    <TableOfContentsPage tocSections={tocSections} />,
    <ScopeOfWorkPage
      report={report}
      tocSections={tocSections}
      willCaptureToc={willCaptureToc}
    />,
    <AntennaInventoryPage
      antennaNotes={report.notes_antenna}
      antennaInventory={report.antenna_inventory}
      tocSections={tocSections}
      willCaptureToc={willCaptureToc}
    />,
    // Use spread operator to include arrays returned by components
    ...DeficienciesPage({
      report,
      tocSections,
      willCaptureToc,
    }),
    ...SitePhotosPage({
      report,
      tocSections,
      willCaptureToc,
    }),
    // Reactivate Appendices
    ...AppendixA({
      redlinePages: report.redline_pages,
      tocSections,
      willCaptureToc,
    }),
    ...AppendixB({
      tocSections,
      willCaptureToc,
      redlinePages: report.redline_pages,
    }),
    ...AppendixC({
      report,
      tocSections,
      willCaptureToc,
    }),
  ];

  const totalPages = pages.length;

  // Now map over these pages to include page numbers
  return (
    <Document>
      {pages.map((PageContent, index) => (
        <Page
          key={index}
          size="LETTER"
          style={StylesPDF.page}>
          {/* Render the page content */}
          {PageContent}
          {/* Add footer with page number */}

          <Text
            fixed
            style={StylesPDF.pageCount}>
            Page{" "}
            <Text style={{ fontFamily: "Helvetica-Bold" }}>{index + 1}</Text> of{" "}
            {totalPages}
          </Text>

          <PdfImg
            fixed
            src="/reports/rogers/rogers-footer.jpg"
            style={StylesPDF.pageImageFooter}
          />
        </Page>
      ))}
    </Document>
  );
};

export default ReportDocument;
