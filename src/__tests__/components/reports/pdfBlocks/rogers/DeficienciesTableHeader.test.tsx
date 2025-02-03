import React from "react";
import { render } from "@testing-library/react";

import DeficienciesTableHeader from "@/components/reports/pdfBlocks/rogers/DeficienciesTableHeader";

// Mock @react-pdf/renderer
jest.mock("@react-pdf/renderer", () => ({
  View: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div data-testid="pdf-view" style={style}>
      {children}
    </div>
  ),
  Text: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <span data-testid="pdf-text" style={style}>
      {children}
    </span>
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

describe("DeficienciesTableHeader", () => {
  it("renders without crashing", () => {
    const { container } = render(<DeficienciesTableHeader />);

    expect(container).toBeTruthy();
  });

  it("renders the correct header columns", () => {
    const { getAllByTestId } = render(<DeficienciesTableHeader />);
    const headerTexts = getAllByTestId("pdf-text").map((el) => el.textContent);

    expect(headerTexts).toEqual([
      "Item #",
      "Checking Procedure",
      "Deficiency",
      "Recommendation",
      "Ref. Photo #",
    ]);
  });

  it("applies the correct container style", () => {
    const { getByTestId } = render(<DeficienciesTableHeader />);
    const container = getByTestId("pdf-view");

    expect(container).toHaveStyle({
      flexDirection: "row",
      backgroundColor: "#f3f4f6",
    });
  });

  it("renders all header columns with correct styles", () => {
    const { getAllByTestId } = render(<DeficienciesTableHeader />);
    const headerElements = getAllByTestId("pdf-text");

    expect(headerElements).toHaveLength(5);

    // Check that we have all the necessary header cells with their styles
    const expectedStyles = [
      { width: "10%" }, // Item #
      { width: "25%" }, // Checking Procedure
      { width: "25%" }, // Deficiency
      { width: "25%" }, // Recommendation
      { width: "15%" }, // Ref. Photo #
    ];

    headerElements.forEach((element, index) => {
      expect(element).toHaveStyle(expectedStyles[index]);
    });
  });
});
