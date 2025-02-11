import React from "react";
import { render } from "@testing-library/react";

import AntennaInventoryTableRow from "@/components/reports/pdfBlocks/rogers/AntennaInventoryTableRow";
import { AntennaTransmissionLine } from "@/src/interfaces/reports";

// Mock @react-pdf/renderer
jest.mock("@react-pdf/renderer", () => ({
  View: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div
      data-testid="pdf-view"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
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
      trContainerA: {
        ...styles.trContainerA,
        flexDirection: "row",
      },
      trElevation: {
        ...styles.trElevation,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      trAntenna: {
        ...styles.trAntenna,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    }),
  },
}));

// Mock parseTextBold utility
jest.mock("@/lib/pdfRenderUtils", () => ({
  parseTextBold: (text: string) => `<b>${text}</b>`,
}));

describe("AntennaInventoryTableRow", () => {
  const mockItems: AntennaTransmissionLine[] = [
    {
      id: "1",
      elevation: "100",
      equipment: "Test Equipment 1",
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
      equipment: "Test Equipment 2",
      quantity: "1",
      azimuth: "90",
      tx_line: "Test Line 2",
      odu: "Test ODU 2",
      carrier: "Carrier 2",
      projectId: "2",
    },
  ];

  it("renders without crashing", () => {
    const { container } = render(
      <AntennaInventoryTableRow items={mockItems} />,
    );

    expect(container).toBeTruthy();
  });

  it("renders correct number of rows", () => {
    const { getAllByTestId } = render(
      <AntennaInventoryTableRow items={mockItems} />,
    );
    const containers = getAllByTestId("pdf-view").filter(
      (el) => el.style.flexDirection === "row",
    );

    expect(containers).toHaveLength(mockItems.length);
  });

  it("displays all item properties correctly", () => {
    const { getAllByTestId } = render(
      <AntennaInventoryTableRow items={mockItems} />,
    );
    const texts = getAllByTestId("pdf-text").map((el) => el.textContent);

    mockItems.forEach((item) => {
      expect(texts).toContain(item.elevation);
      expect(texts).toContain(
        `(<b>${item.quantity}</b>) <b>${item.equipment}</b>`,
      );
      expect(texts).toContain(item.azimuth);
      expect(texts).toContain(`<b>${item.tx_line}</b>`);
      expect(texts).toContain(`<b>${item.odu}</b>`);
      expect(texts).toContain(item.carrier);
    });
  });

  it("handles empty items array", () => {
    const { container } = render(<AntennaInventoryTableRow items={[]} />);
    const rows = container.getElementsByTagName("div");

    expect(rows.length).toBe(0);
  });

  it("handles items with empty values", () => {
    const itemsWithEmpty: AntennaTransmissionLine[] = [
      {
        id: "3",
        elevation: "",
        equipment: "",
        quantity: "",
        azimuth: "",
        tx_line: "",
        odu: "",
        carrier: "",
        projectId: "3",
      },
    ];

    const { getAllByTestId } = render(
      <AntennaInventoryTableRow items={itemsWithEmpty} />,
    );
    const texts = getAllByTestId("pdf-text").map((el) => el.textContent);

    expect(texts).toContain("");
    expect(texts).toContain("(<b></b>) <b></b>");
  });

  it("applies correct styles to row elements", () => {
    const { getAllByTestId } = render(
      <AntennaInventoryTableRow items={mockItems} />,
    );
    const rows = getAllByTestId("pdf-view");

    // Check main container styles
    const containers = rows.filter((el) => el.style.flexDirection === "row");

    expect(containers).toHaveLength(mockItems.length);

    // Check cell styles - excluding containers
    const cells = rows.filter((el) => !el.style.flexDirection);

    cells.forEach((cell) => {
      expect(cell).toHaveStyle({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      });
    });
  });
});
