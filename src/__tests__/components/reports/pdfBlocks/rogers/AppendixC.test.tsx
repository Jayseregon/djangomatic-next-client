import React from "react";
import { render } from "@testing-library/react";

import AppendixC from "@/components/reports/pdfBlocks/rogers/AppendixC";
import { TOCSections, TowerReport } from "@/src/interfaces/reports";

// Mock @react-pdf/renderer
jest.mock("@react-pdf/renderer", () => ({
  View: ({
    children,
    style,
    wrap,
  }: {
    children: React.ReactNode;
    style?: any;
    wrap?: boolean;
  }) => (
    <div data-testid="pdf-view" data-wrap={wrap?.toString()} style={style}>
      {children}
    </div>
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

// Mock TOCSection component
jest.mock("@/components/reports/pdfBlocks/rogers/TOCSection", () => ({
  __esModule: true,
  default: ({ children, id }: { children: React.ReactNode; id: string }) => (
    <div data-testid={`toc-section-${id}`}>{children}</div>
  ),
}));

// Mock AppendixCTable component
jest.mock("@/components/reports/pdfBlocks/rogers/AppendixCTable", () => ({
  __esModule: true,
  default: ({
    formNb,
    title,
    type,
  }: {
    formNb: string;
    title: string;
    type: string;
  }) => (
    <div data-testid={`appendix-table-${formNb}`}>
      <span data-testid={`table-title-${formNb}`}>{title}</span>
      <span data-testid={`table-type-${formNb}`}>{type}</span>
    </div>
  ),
}));

describe("AppendixC", () => {
  const mockReport: TowerReport = {
    redline_pages: 5,
    checklistForm4: Array(25).fill({ id: "1", code: "test", comments: "test" }),
    checklistForm5: Array(5).fill({ id: "1", code: "test", comments: "test" }),
    checklistForm6: Array(5).fill({ id: "1", code: "test", comments: "test" }),
    checklistForm7: Array(5).fill({ id: "1", code: "test", comments: "test" }),
    checklistForm8: Array(5).fill({ id: "1", code: "test", comments: "test" }),
    checklistForm9: Array(5).fill({ id: "1", code: "test", comments: "test" }),
    checklistForm10: Array(5).fill({ id: "1", code: "test", comments: "test" }),
    checklistForm11: Array(5).fill({ id: "1", code: "test", comments: "test" }),
  } as TowerReport;

  const mockProps = {
    report: mockReport,
    tocSections: [
      { title: "Appendix C", pageNumber: 1 },
      { title: "Post Construction Itemized Checklist", pageNumber: 2 },
    ] as TOCSections[],
    willCaptureToc: true,
  };

  it("renders without crashing", () => {
    const { container } = render(<AppendixC {...mockProps} />);

    expect(container).toBeTruthy();
  });

  it("renders title page with correct TOC sections", () => {
    const { getByTestId } = render(<AppendixC {...mockProps} />);

    expect(getByTestId("toc-section-appendix-c")).toHaveTextContent(
      "Appendix C",
    );
    expect(
      getByTestId("toc-section-post-construction-itemized-checklist"),
    ).toHaveTextContent("Post Construction Itemized Checklist");
  });

  it("splits Form 4 into multiple pages when needed", () => {
    const { getAllByTestId } = render(<AppendixC {...mockProps} />);
    const form4Tables = getAllByTestId(/appendix-table-4/);

    expect(form4Tables).toHaveLength(2);
  });

  it("renders all checklist forms", () => {
    const { getAllByTestId } = render(<AppendixC {...mockProps} />);

    // Form 4 appears twice (original and continued)
    const form4Tables = getAllByTestId("appendix-table-4");

    expect(form4Tables).toHaveLength(2);

    // Check other forms (5-11)
    for (let i = 5; i <= 11; i++) {
      expect(getAllByTestId(`appendix-table-${i}`)).toHaveLength(1);
    }
  });

  it("sets wrap={false} on all pages", () => {
    const { getAllByTestId } = render(<AppendixC {...mockProps} />);
    const pages = getAllByTestId("pdf-view");

    pages.forEach((page) => {
      const wrap = page.getAttribute("data-wrap");

      if (wrap !== null) {
        expect(wrap).toBe("false");
      }
    });
  });

  it("renders correct titles and types for each form", () => {
    const { getAllByTestId } = render(<AppendixC {...mockProps} />);

    // Test Form 4 (both parts)
    const form4Titles = getAllByTestId("table-title-4");

    expect(form4Titles[0]).toHaveTextContent(
      "Antenna Structure and Site Works",
    );
    expect(form4Titles[1]).toHaveTextContent(
      "Antenna Structure and Site Works - (Continued)",
    );
    expect(getAllByTestId("table-type-4")[0]).toHaveTextContent("Civil");

    // Test Form 8
    expect(getAllByTestId("table-title-8")[0]).toHaveTextContent(
      "Cellular Base Station",
    );
    expect(getAllByTestId("table-type-8")[0]).toHaveTextContent(
      "Technical Install & Commission",
    );

    // Test Form 11
    expect(getAllByTestId("table-title-11")[0]).toHaveTextContent(
      "Miscellaneous Equipment",
    );
    expect(getAllByTestId("table-type-11")[0]).toHaveTextContent(
      "Technical Install & Commission",
    );
  });
});
