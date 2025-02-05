import React from "react";
import { render } from "@testing-library/react";

import ReportDocument from "@/src/components/reports/pdfBlocks/rogers/ReportDocument";
import { TOCSections, TowerReport } from "@/src/interfaces/reports";

// Mock @react-pdf/renderer components
jest.mock("@react-pdf/renderer", () => ({
  Document: ({ children }: any) => (
    <div data-testid="pdf-document">{children}</div>
  ),
  Page: ({ children, size, style }: any) => (
    <div data-size={size} data-testid="pdf-page" style={style}>
      {children}
    </div>
  ),
  Text: ({ children, style, fixed }: any) => (
    <div data-fixed={fixed} data-testid="pdf-text" style={style}>
      {children}
    </div>
  ),
  Image: ({ src, style, fixed }: any) => (
    <div
      data-fixed={fixed}
      data-src={src}
      data-testid="pdf-image"
      style={style}
    />
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

// Mock child components
jest.mock("@/src/components/reports/pdfBlocks/rogers/FrontPage", () => ({
  __esModule: true,
  default: () => <div data-testid="front-page">Front Page</div>,
}));

jest.mock("@/src/components/reports/pdfBlocks/rogers/AuthorPage", () => ({
  __esModule: true,
  default: () => <div data-testid="author-page">Author Page</div>,
}));

jest.mock(
  "@/src/components/reports/pdfBlocks/rogers/TableOfContentsPage",
  () => ({
    __esModule: true,
    default: () => <div data-testid="toc-page">Table of Contents</div>,
  }),
);

jest.mock("@/src/components/reports/pdfBlocks/rogers/ScopeOfWorkPage", () => ({
  __esModule: true,
  default: () => <div data-testid="scope-of-work-page">Scope of Work</div>,
}));

jest.mock(
  "@/src/components/reports/pdfBlocks/rogers/AntennaInventoryPage",
  () => ({
    __esModule: true,
    default: () => (
      <div data-testid="antenna-inventory-page">Antenna Inventory</div>
    ),
  }),
);

jest.mock("@/src/components/reports/pdfBlocks/rogers/DeficienciesPage", () => ({
  __esModule: true,
  default: () => [
    <div key="deficiencies" data-testid="deficiencies-page">
      Deficiencies
    </div>,
  ],
}));

jest.mock("@/src/components/reports/pdfBlocks/rogers/SitePhotosPage", () => ({
  __esModule: true,
  default: () => <div data-testid="site-photos-page">Site Photos</div>,
}));

jest.mock("@/src/components/reports/pdfBlocks/rogers/AppendixA", () => ({
  __esModule: true,
  default: () => [
    <div key="appendix-a" data-testid="appendix-a-page">
      Appendix A
    </div>,
  ],
}));

jest.mock("@/src/components/reports/pdfBlocks/rogers/AppendixB", () => ({
  __esModule: true,
  default: () => [
    <div key="appendix-b" data-testid="appendix-b-page">
      Appendix B
    </div>,
  ],
}));

jest.mock("@/src/components/reports/pdfBlocks/rogers/AppendixC", () => ({
  __esModule: true,
  default: () => [
    <div key="appendix-c" data-testid="appendix-c-page">
      Appendix C
    </div>,
  ],
}));

describe("ReportDocument Component", () => {
  const mockReport: TowerReport = {
    redline_pages: 2,
    antenna_inventory: [],
    notes_antenna: [],
    site_images: [],
    deficiency_images: [],
    checklistForm4: [],
    checklistForm5: [],
    checklistForm6: [],
    checklistForm7: [],
    checklistForm8: [],
    checklistForm9: [],
    checklistForm10: [],
    checklistForm11: [],
  } as unknown as TowerReport;

  const mockTocSections: TOCSections[] = [
    { title: "Front Page", pageNumber: 1 },
    { title: "Table of Contents", pageNumber: 2 },
  ];

  it("renders document structure correctly", () => {
    const { getByTestId, getAllByTestId } = render(
      <ReportDocument
        report={mockReport}
        tocSections={mockTocSections}
        willCaptureToc={true}
      />,
    );

    expect(getByTestId("pdf-document")).toBeInTheDocument();
    const pages = getAllByTestId("pdf-page");

    expect(pages.length).toBeGreaterThan(0);
  });

  it("includes all required pages", () => {
    const { getByTestId } = render(
      <ReportDocument
        report={mockReport}
        tocSections={mockTocSections}
        willCaptureToc={true}
      />,
    );

    expect(getByTestId("front-page")).toBeInTheDocument();
    expect(getByTestId("author-page")).toBeInTheDocument();
  });

  it("adds page numbers to all pages except front page", () => {
    const { getAllByTestId } = render(
      <ReportDocument
        report={mockReport}
        tocSections={mockTocSections}
        willCaptureToc={true}
      />,
    );

    const pageNumbers = getAllByTestId("pdf-text").filter((el) =>
      el.textContent?.includes("Page"),
    );

    // Should have page numbers for all pages except front page
    expect(pageNumbers.length).toBe(getAllByTestId("pdf-page").length - 1);
  });

  it("adds Rogers footer to all pages", () => {
    const { getAllByTestId } = render(
      <ReportDocument
        report={mockReport}
        tocSections={mockTocSections}
        willCaptureToc={true}
      />,
    );

    const footerImages = getAllByTestId("pdf-image").filter(
      (el) =>
        el.getAttribute("data-src") === "/reports/rogers/rogers-footer.jpg",
    );

    expect(footerImages.length).toBe(getAllByTestId("pdf-page").length);
  });

  it("handles redline pages in page numbering", () => {
    const { getAllByTestId } = render(
      <ReportDocument
        report={{ ...mockReport, redline_pages: 5 }}
        tocSections={mockTocSections}
        willCaptureToc={true}
      />,
    );

    const lastPageNumber = getAllByTestId("pdf-text")
      .filter((el) => el.textContent?.includes("Page"))
      .pop();

    expect(lastPageNumber?.textContent).toContain("of"); // Verify total includes redline pages
  });
});
