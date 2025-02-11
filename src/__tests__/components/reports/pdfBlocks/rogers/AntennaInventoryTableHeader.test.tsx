import React from "react";
import { render } from "@testing-library/react";

import AntennaInventoryTableHeader from "@/components/reports/pdfBlocks/rogers/AntennaInventoryTableHeader";

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
      thContainerA: {
        ...styles.thContainerA,
        display: "flex",
      },
    }),
  },
}));

describe("AntennaInventoryTableHeader", () => {
  const expectedHeaders = [
    "Elev. (m)",
    "(Qty) Antenna/Equipment",
    "Az (°)",
    "Tx. Lines",
    "ODUs",
    "Carrier",
  ];

  it("renders without crashing", () => {
    const { container } = render(<AntennaInventoryTableHeader />);

    expect(container).toBeTruthy();
  });

  it("renders all header columns", () => {
    const { getAllByTestId } = render(<AntennaInventoryTableHeader />);
    const headerTexts = getAllByTestId("pdf-text");

    expect(headerTexts).toHaveLength(expectedHeaders.length);
  });

  it("displays correct header texts", () => {
    const { getAllByTestId } = render(<AntennaInventoryTableHeader />);
    const headerTexts = getAllByTestId("pdf-text").map((el) => el.textContent);

    expectedHeaders.forEach((header) => {
      expect(headerTexts).toContain(header);
    });
  });

  it("renders with correct container style", () => {
    const { getByTestId } = render(<AntennaInventoryTableHeader />);
    const container = getByTestId("pdf-view");

    // Verify the container has the thContainerA style applied
    expect(container).toHaveStyle({ display: "flex" });
  });

  it("renders header texts in correct order", () => {
    const { getAllByTestId } = render(<AntennaInventoryTableHeader />);
    const headerTexts = getAllByTestId("pdf-text").map((el) => el.textContent);

    expect(headerTexts).toEqual(expectedHeaders);
  });
});
