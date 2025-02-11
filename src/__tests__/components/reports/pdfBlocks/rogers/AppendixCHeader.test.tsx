import React from "react";
import { render } from "@testing-library/react";

import AppendixCHeader from "@/components/reports/pdfBlocks/rogers/AppendixCHeader";

// Mock @react-pdf/renderer
jest.mock("@react-pdf/renderer", () => ({
  View: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div data-testid="pdf-view" style={{ display: "flex", ...style }}>
      {children}
    </div>
  ),
  Text: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <span data-testid="pdf-text" style={style}>
      {children}
    </span>
  ),
  StyleSheet: {
    create: (styles: any) => ({
      ...styles,
      thContainerC: {
        ...styles.thContainerC,
        display: "flex",
      },
    }),
  },
}));

describe("AppendixCHeader", () => {
  const expectedHeaders = ["Code", "Item", "Yes", "No", "N/A", "Comments"];

  it("renders without crashing", () => {
    const { container } = render(<AppendixCHeader />);

    expect(container).toBeTruthy();
  });

  it("renders all header columns", () => {
    const { getAllByTestId } = render(<AppendixCHeader />);
    const headerTexts = getAllByTestId("pdf-text");

    expect(headerTexts).toHaveLength(expectedHeaders.length);
  });

  it("displays correct header texts", () => {
    const { getAllByTestId } = render(<AppendixCHeader />);
    const headerTexts = getAllByTestId("pdf-text").map((el) => el.textContent);

    expectedHeaders.forEach((header) => {
      expect(headerTexts).toContain(header);
    });
  });

  it("renders header texts in correct order", () => {
    const { getAllByTestId } = render(<AppendixCHeader />);
    const headerTexts = getAllByTestId("pdf-text").map((el) => el.textContent);

    expect(headerTexts).toEqual(expectedHeaders);
  });

  it("renders with correct container style", () => {
    const { getByTestId } = render(<AppendixCHeader />);
    const container = getByTestId("pdf-view");

    expect(container).toHaveStyle({ display: "flex" });
  });

  it("applies correct styles to text elements", () => {
    const { getAllByTestId } = render(<AppendixCHeader />);
    const textElements = getAllByTestId("pdf-text");

    // Verify text elements have the correct StylesPDF styles applied
    expect(textElements[0]).toHaveAttribute("style"); // Code
    expect(textElements[1]).toHaveAttribute("style"); // Item
    expect(textElements[2]).toHaveAttribute("style"); // Yes
    expect(textElements[3]).toHaveAttribute("style"); // No
    expect(textElements[4]).toHaveAttribute("style"); // N/A
    expect(textElements[5]).toHaveAttribute("style"); // Comments
  });
});
