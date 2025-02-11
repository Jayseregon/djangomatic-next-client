import React from "react";
import { render } from "@testing-library/react";

import DeficienciesTable from "@/components/reports/pdfBlocks/rogers/DeficienciesTable";
import { TowerReportImage } from "@/src/interfaces/reports";

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

describe("DeficienciesTable", () => {
  const mockItems: TowerReportImage[] = [
    {
      id: "1",
      url: "https://example.com/image1.jpg",
      label: "Deficiency 1",
      deficiency_check_procedure: "Check Procedure 1",
      deficiency_recommendation: "Fix Issue 1",
      imgIndex: 0,
      azureId: "azure1",
    },
    {
      id: "2",
      url: "https://example.com/image2.jpg",
      label: "Deficiency 2",
      deficiency_check_procedure: "Check Procedure 2",
      deficiency_recommendation: "Fix Issue 2",
      imgIndex: 1,
      azureId: "azure2",
    },
  ];

  it("renders table with header", () => {
    const { getAllByTestId } = render(<DeficienciesTable items={mockItems} />);
    const viewElements = getAllByTestId("pdf-view");
    const textElements = getAllByTestId("pdf-text");

    expect(viewElements.length).toBeGreaterThan(0);
    expect(textElements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textContent: "Item #" }),
        expect.objectContaining({ textContent: "Checking Procedure" }),
        expect.objectContaining({ textContent: "Deficiency" }),
        expect.objectContaining({ textContent: "Recommendation" }),
        expect.objectContaining({ textContent: "Ref. Photo #" }),
      ]),
    );
  });

  it("renders correct number of rows", () => {
    const { getAllByTestId } = render(<DeficienciesTable items={mockItems} />);
    const rows = getAllByTestId("pdf-view").filter((el) => {
      const style = el.getAttribute("style");

      return (
        style?.includes("flexDirection: row") ||
        style?.includes("flex-direction: row")
      );
    });

    // Header row + one row per item
    const expectedMinimumRows = 1 + mockItems.length; // 1 for header, plus data rows

    expect(rows.length).toBeGreaterThanOrEqual(expectedMinimumRows);
  });

  it("displays deficiency information correctly", () => {
    const { getAllByTestId } = render(<DeficienciesTable items={mockItems} />);
    const textElements = getAllByTestId("pdf-text");
    const texts = textElements.map((el) => el.textContent);

    mockItems.forEach((item, index) => {
      expect(texts).toContain((index + 1).toString());
      expect(texts).toContain(item.deficiency_check_procedure);
      expect(texts).toContain(item.label);
      expect(texts).toContain(item.deficiency_recommendation);
      expect(texts).toContain((index + 1).toString()); // Photo reference number
    });
  });

  it("renders empty table when no items provided", () => {
    const { getAllByTestId } = render(<DeficienciesTable items={[]} />);
    const viewElements = getAllByTestId("pdf-view");
    const textElements = getAllByTestId("pdf-text");

    // Should have container and header elements at minimum
    expect(viewElements.length).toBeGreaterThan(0);
    expect(textElements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textContent: "Item #" }),
        expect.objectContaining({ textContent: "Checking Procedure" }),
        expect.objectContaining({ textContent: "Deficiency" }),
        expect.objectContaining({ textContent: "Recommendation" }),
        expect.objectContaining({ textContent: "Ref. Photo #" }),
      ]),
    );
  });

  it("handles missing optional fields", () => {
    const incompleteItem: TowerReportImage[] = [
      {
        id: "3",
        url: "https://example.com/image3.jpg",
        label: "Deficiency 3",
        deficiency_check_procedure: "",
        deficiency_recommendation: "",
        imgIndex: 2,
        azureId: "azure3",
      },
    ];

    const { getAllByTestId } = render(
      <DeficienciesTable items={incompleteItem} />,
    );
    const textElements = getAllByTestId("pdf-text");
    const texts = textElements.map((el) => el.textContent);

    expect(texts).toContain("3"); // Item number
    expect(texts).toContain("Deficiency 3"); // Label
    expect(texts).toContain(""); // Empty procedure
    expect(texts).toContain(""); // Empty recommendation
  });

  it("maintains correct order based on imgIndex", () => {
    const unorderedItems: TowerReportImage[] = [
      {
        ...mockItems[1],
        imgIndex: 0,
      },
      {
        ...mockItems[0],
        imgIndex: 1,
      },
    ];

    const { getAllByTestId } = render(
      <DeficienciesTable items={unorderedItems} />,
    );
    const textElements = getAllByTestId("pdf-text");
    const deficiencyTexts = textElements
      .filter((el) =>
        unorderedItems.some((item) => item.label === el.textContent),
      )
      .map((el) => el.textContent);

    expect(deficiencyTexts[0]).toBe("Deficiency 2");
    expect(deficiencyTexts[1]).toBe("Deficiency 1");
  });
});
