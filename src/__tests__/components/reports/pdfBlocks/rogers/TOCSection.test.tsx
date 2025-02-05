import React from "react";
import { render } from "@testing-library/react";

import TOCSectionPDF from "@/src/components/reports/pdfBlocks/rogers/TOCSection";
import { TOCSections } from "@/src/interfaces/reports";

// Mock @react-pdf/renderer components
jest.mock("@react-pdf/renderer", () => ({
  Text: ({ children, style, id, render }: any) => {
    if (render) {
      return render({ pageNumber: 1 });
    }

    return (
      <div data-id={id} data-testid="pdf-text" style={style}>
        {children}
      </div>
    );
  },
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

describe("TOCSection Component", () => {
  const mockStyle = { fontSize: 14, color: "black" };
  const mockTocSections: TOCSections[] = [];

  it("renders text content when not capturing TOC", () => {
    const { getByTestId } = render(
      <TOCSectionPDF
        id="test-section"
        style={mockStyle}
        tocSections={mockTocSections}
        willCaptureToc={false}
      >
        Test Section
      </TOCSectionPDF>,
    );

    const textElement = getByTestId("pdf-text");

    expect(textElement).toHaveTextContent("Test Section");
    expect(textElement).toHaveAttribute("data-id", "test-section");
  });

  it("captures section in TOC when willCaptureToc is true", () => {
    const sections: TOCSections[] = [];

    render(
      <TOCSectionPDF
        id="test-section"
        style={mockStyle}
        tocSections={sections}
        willCaptureToc={true}
      >
        Test Section
      </TOCSectionPDF>,
    );

    expect(sections).toHaveLength(1);
    expect(sections[0]).toEqual({
      title: "Test Section",
      pageNumber: 1,
    });
  });

  it("handles redline pages correctly", () => {
    const sections: TOCSections[] = [];

    render(
      <TOCSectionPDF
        id="test-section"
        jumpRedlines={true}
        redlinePages={5}
        style={mockStyle}
        tocSections={sections}
        willCaptureToc={true}
      >
        Test Section
      </TOCSectionPDF>,
    );

    expect(sections[0].pageNumber).toBe(6); // 1 + 5 redline pages
  });

  it("replaces existing TOC entry with same title", () => {
    const sections: TOCSections[] = [{ title: "Test Section", pageNumber: 1 }];

    render(
      <TOCSectionPDF
        id="test-section"
        style={mockStyle}
        tocSections={sections}
        willCaptureToc={true}
      >
        Test Section
      </TOCSectionPDF>,
    );

    expect(sections).toHaveLength(1);
    expect(sections[0]).toEqual({
      title: "Test Section",
      pageNumber: 1,
    });
  });

  it("handles React element children correctly", () => {
    const sections: TOCSections[] = [];

    render(
      <TOCSectionPDF
        id="test-section"
        style={mockStyle}
        tocSections={sections}
        willCaptureToc={true}
      >
        <span>Test Section</span>
      </TOCSectionPDF>,
    );

    expect(sections[0].title).toBe("Test Section");
  });

  it("applies provided styles", () => {
    const customStyle = { fontSize: 16, color: "blue" };

    const { getByTestId } = render(
      <TOCSectionPDF
        id="test-section"
        style={customStyle}
        tocSections={mockTocSections}
        willCaptureToc={false}
      >
        Test Section
      </TOCSectionPDF>,
    );

    const textElement = getByTestId("pdf-text");

    expect(textElement).toHaveStyle(customStyle);
  });
});
