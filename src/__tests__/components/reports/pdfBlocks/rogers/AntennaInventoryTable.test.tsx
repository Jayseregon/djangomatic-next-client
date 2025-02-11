import React from "react";
import { render } from "@testing-library/react";

import AntennaInventoryTable from "@/components/reports/pdfBlocks/rogers/AntennaInventoryTable";
import { AntennaTransmissionLine } from "@/src/interfaces/reports";

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

// Mock the parseTextBold utility
jest.mock("@/lib/pdfRenderUtils", () => ({
  parseTextBold: (text: string) => text,
}));

describe("AntennaInventoryTable", () => {
  const mockItems: AntennaTransmissionLine[] = [
    {
      id: "1",
      elevation: "100",
      equipment: "Test Antenna 1",
      quantity: "2",
      azimuth: "180",
      tx_line: "Test Line 1",
      odu: "Test ODU 1",
      carrier: "Carrier 1",
      projectId: "1",
    },
    {
      id: "2",
      elevation: "200",
      equipment: "Test Antenna 2",
      quantity: "1",
      azimuth: "90",
      tx_line: "Test Line 2",
      odu: "Test ODU 2",
      carrier: "Carrier 2",
      projectId: "2",
    },
  ];

  it("renders table with header", () => {
    const { getAllByTestId } = render(
      <AntennaInventoryTable items={mockItems} />,
    );
    const viewElements = getAllByTestId("pdf-view");

    expect(viewElements.length).toBeGreaterThan(0);
  });

  it("renders correct number of rows", () => {
    const { getAllByTestId } = render(
      <AntennaInventoryTable items={mockItems} />,
    );
    const rows = getAllByTestId("pdf-view");

    // Should include container, header row, and data rows
    expect(rows.length).toBeGreaterThan(mockItems.length);
  });

  it("displays antenna information correctly", () => {
    const { getAllByTestId } = render(
      <AntennaInventoryTable items={mockItems} />,
    );
    const textElements = getAllByTestId("pdf-text");

    mockItems.forEach((item) => {
      const texts = textElements.map((el) => el.textContent);

      expect(texts).toContain(item.elevation);
      expect(texts).toContain(`(${item.quantity}) ${item.equipment}`);
      expect(texts).toContain(item.azimuth);
      expect(texts).toContain(item.tx_line);
      expect(texts).toContain(item.odu);
      expect(texts).toContain(item.carrier);
    });
  });

  it("renders empty table when no items provided", () => {
    const { getAllByTestId } = render(<AntennaInventoryTable items={[]} />);
    const viewElements = getAllByTestId("pdf-view");

    // Should have container and header elements at minimum
    expect(viewElements.length).toBeGreaterThan(0);
  });

  it("handles missing optional fields", () => {
    const incompleteItem: AntennaTransmissionLine[] = [
      {
        id: "3",
        elevation: "300",
        equipment: "Test Antenna 3",
        quantity: "1",
        azimuth: "",
        tx_line: "",
        odu: "",
        carrier: "",
        projectId: "3",
      },
    ];

    const { getAllByTestId } = render(
      <AntennaInventoryTable items={incompleteItem} />,
    );
    const textElements = getAllByTestId("pdf-text");
    const texts = textElements.map((el) => el.textContent);

    expect(texts).toContain("300");
    expect(texts).toContain("(1) Test Antenna 3");
  });
});
