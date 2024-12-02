import React from "react";
import { Document, Page, Text, Image as PdfImg } from "@react-pdf/renderer";

import { TOCSections, TowerReport } from "@/src/types/reports";
import { StylesPDF } from "@/styles/stylesPDF";

import FrontPage from "./FrontPage";
import AuthorPage from "./AuthorPage";
import TableOfContentsPage from "./TableOfContentsPage";
import ScopeOfWorkPage from "./ScopeOfWorkPage";
import AntennaInventoryPage from "./AntennaInventoryPage";
import DeficienciesPage from "./DeficienciesPage";
import SitePhotosPage from "./SitePhotosPage";
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
    <FrontPage key="front-page" report={report} />,
    <AuthorPage key="author-page" report={report} />,
    <TableOfContentsPage key="toc-page" tocSections={tocSections} />,
    <ScopeOfWorkPage
      key="scope-of-work-page"
      report={report}
      tocSections={tocSections}
      willCaptureToc={willCaptureToc}
    />,
    <AntennaInventoryPage
      key="antenna-inventory-page"
      antennaInventory={report.antenna_inventory}
      antennaNotes={report.notes_antenna}
      tocSections={tocSections}
      willCaptureToc={willCaptureToc}
    />,
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
    ...AppendixA({
      tocSections,
      willCaptureToc,
    }),
  ];

  const postRedlinesPages = [
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

  const totalPages = pages.length + postRedlinesPages.length;

  // Now map over these pages to include page numbers
  return (
    <Document>
      {pages.map((PageContent, index) => (
        <Page key={index} size="LETTER" style={StylesPDF.page}>
          {/* Render the page content */}
          {PageContent}
          {/* Add page number if not the first page */}
          {index !== 0 && (
            <Text fixed style={StylesPDF.pageCount}>
              Page{" "}
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{index + 1}</Text>{" "}
              of {totalPages + report.redline_pages}
            </Text>
          )}
          {/* Add footer image */}
          <PdfImg
            fixed
            src="/reports/rogers/rogers-footer.jpg"
            style={StylesPDF.pageImageFooter}
          />
        </Page>
      ))}
      {postRedlinesPages.map((PageContent, index) => (
        <Page key={pages.length + index} size="LETTER" style={StylesPDF.page}>
          {/* Render the page content */}
          {PageContent}
          {/* Add page number */}
          <Text fixed style={StylesPDF.pageCount}>
            Page{" "}
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              {pages.length + index + 1 + report.redline_pages}
            </Text>{" "}
            of {totalPages + report.redline_pages}
          </Text>
          {/* Add footer image */}
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
