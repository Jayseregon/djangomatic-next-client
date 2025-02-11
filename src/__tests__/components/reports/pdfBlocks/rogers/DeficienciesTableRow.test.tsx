import React from "react";
import { render } from "@testing-library/react";

import DeficienciesTableRow from "@/components/reports/pdfBlocks/rogers/DeficienciesTableRow";
import { TowerReportImage } from "@/interfaces/reports";

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
      trContainerD: {
        ...styles.trContainerD,
        flexDirection: "row",
      },
      trItemNb: {
        ...styles.trItemNb,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "10%",
      },
      trProcedure: {
        ...styles.trProcedure,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "25%",
      },
    }),
  },
}));

describe("DeficienciesTableRow", () => {
  const mockItems: TowerReportImage[] = [
    {
      id: "1",
      url: "https://example.com/image1.jpg",
      label: "First Deficiency",
      deficiency_check_procedure: "Check Procedure 1",
      deficiency_recommendation: "Fix Issue 1",
      imgIndex: 0,
      azureId: "azure1",
    },
    {
      id: "2",
      url: "https://example.com/image2.jpg",
      label: "Second Deficiency",
      deficiency_check_procedure: "Check Procedure 2",
      deficiency_recommendation: "Fix Issue 2",
      imgIndex: 1,
      azureId: "azure2",
    },
  ];

  it("renders without crashing", () => {
    const { container } = render(<DeficienciesTableRow items={mockItems} />);

    expect(container).toBeTruthy();
  });

  it("renders correct number of rows", () => {
    const { getAllByTestId } = render(
      <DeficienciesTableRow items={mockItems} />,
    );
    const rows = getAllByTestId("pdf-view").filter((el) => {
      const style = el.getAttribute("style");

      return (
        style?.includes("display: flex") &&
        style?.includes("flex-direction: row")
      );
    });

    expect(rows.length).toBeGreaterThanOrEqual(mockItems.length);
  });

  it("displays all item information correctly", () => {
    const { getAllByTestId } = render(
      <DeficienciesTableRow items={mockItems} />,
    );
    const textElements = getAllByTestId("pdf-text");
    const texts = textElements.map((el) => el.textContent);

    mockItems.forEach((item) => {
      expect(texts).toContain((item.imgIndex + 1).toString()); // Item number
      expect(texts).toContain(item.deficiency_check_procedure);
      expect(texts).toContain(item.label);
      expect(texts).toContain(item.deficiency_recommendation);
      expect(texts).toContain((item.imgIndex + 1).toString()); // Photo reference
    });
  });

  it("handles empty items array", () => {
    const { container } = render(<DeficienciesTableRow items={[]} />);

    expect(container).toBeTruthy();
    expect(container.firstChild).toBeNull();
  });

  it("applies correct styles to row containers", () => {
    const { getAllByTestId } = render(
      <DeficienciesTableRow items={mockItems} />,
    );
    const rowContainers = getAllByTestId("pdf-view").filter((el) =>
      el.getAttribute("style")?.includes("flexDirection: row"),
    );

    rowContainers.forEach((container) => {
      expect(container).toHaveStyle({
        flexDirection: "row",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        fontSize: 10,
        textAlign: "center",
      });
    });
  });

  it("handles items with missing fields", () => {
    const incompleteItems: TowerReportImage[] = [
      {
        id: "3",
        url: "https://example.com/image3.jpg",
        label: "",
        deficiency_check_procedure: "",
        deficiency_recommendation: "",
        imgIndex: 2,
        azureId: "azure3",
      },
    ];

    const { getAllByTestId } = render(
      <DeficienciesTableRow items={incompleteItems} />,
    );
    const textElements = getAllByTestId("pdf-text");
    const texts = textElements.map((el) => el.textContent);

    expect(texts).toContain("3"); // Should show index + 1
    expect(texts).toContain(""); // Empty fields should be rendered as empty strings
  });

  it("maintains correct column widths", () => {
    const { getAllByTestId } = render(
      <DeficienciesTableRow items={mockItems} />,
    );
    const cells = getAllByTestId("pdf-view").filter((el) =>
      el.getAttribute("style")?.includes("display: flex"),
    );

    const expectedWidths = {
      "10%": cells.some((el) => el.style.width === "10%"),
      "25%": cells.some((el) => el.style.width === "25%"),
      "15%": cells.some((el) => el.style.width === "15%"),
    };

    expect(
      Object.values(expectedWidths).some((hasWidth) => hasWidth),
    ).toBeTruthy();
    expect(cells.length).toBeGreaterThan(0);
  });
});
