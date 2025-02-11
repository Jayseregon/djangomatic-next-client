import React from "react";
import { render } from "@testing-library/react";

import AppendixA from "@/components/reports/pdfBlocks/rogers/AppendixA";
import { TOCSections } from "@/src/interfaces/reports";

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

describe("AppendixA", () => {
  const mockProps = {
    tocSections: [
      {
        title: "Appendix A",
        pageNumber: 10,
      },
      {
        title: "Redline of Construction Drawings",
        pageNumber: 11,
      },
    ] as TOCSections[],
    willCaptureToc: true,
  };

  it("renders without crashing", () => {
    const { container } = render(<AppendixA {...mockProps} />);

    expect(container).toBeTruthy();
  });

  it("renders both TOC sections with correct titles", () => {
    const { getByTestId } = render(<AppendixA {...mockProps} />);

    const appendixSection = getByTestId("toc-section-appendix-a");
    const redlineSection = getByTestId(
      "toc-section-redline-of-construction-drawings",
    );

    expect(appendixSection).toHaveTextContent("Appendix A");
    expect(redlineSection).toHaveTextContent(
      "Redline of Construction Drawings",
    );
  });

  it("renders with wrap={false} for page breaks", () => {
    const { getAllByTestId } = render(<AppendixA {...mockProps} />);
    const views = getAllByTestId("pdf-view");

    // Check the outer View has wrap={false}
    expect(views[0]).toHaveAttribute("data-wrap", "false");
  });

  it("handles empty TOC sections", () => {
    const propsWithEmptyToc = {
      ...mockProps,
      tocSections: [],
    };

    const { getByTestId } = render(<AppendixA {...propsWithEmptyToc} />);

    // Should still render the sections even with empty TOC
    expect(getByTestId("toc-section-appendix-a")).toBeInTheDocument();
    expect(
      getByTestId("toc-section-redline-of-construction-drawings"),
    ).toBeInTheDocument();
  });

  it("passes willCaptureToc prop correctly", () => {
    const propsWithoutCapture = {
      ...mockProps,
      willCaptureToc: false,
    };

    const { getByTestId } = render(<AppendixA {...propsWithoutCapture} />);

    // Sections should still render when willCaptureToc is false
    expect(getByTestId("toc-section-appendix-a")).toBeInTheDocument();
    expect(
      getByTestId("toc-section-redline-of-construction-drawings"),
    ).toBeInTheDocument();
  });
});
