import React from "react";
import { render } from "@testing-library/react";

import AntennaInventoryPage from "@/components/reports/pdfBlocks/rogers/AntennaInventoryPage";
import {
  Note,
  AntennaTransmissionLine,
  TOCSections,
} from "@/src/interfaces/reports";

// Mock @react-pdf/renderer
jest.mock("@react-pdf/renderer", () => ({
  Document: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Page: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  View: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div style={style}>{children}</div>
  ),
  Text: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <span style={style}>{children}</span>
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

// Other mocks
jest.mock("@/components/reports/pdfBlocks/rogers/TOCSection", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="toc-section">{children}</div>
  ),
}));

jest.mock(
  "@/components/reports/pdfBlocks/rogers/AntennaInventoryTable",
  () => ({
    __esModule: true,
    default: () => <div data-testid="antenna-inventory-table" />,
  }),
);

jest.mock("@/components/reports/pdfBlocks/rogers/PageNotes", () => ({
  __esModule: true,
  default: () => <div data-testid="page-notes" />,
}));

jest.mock("@/components/reports/pdfBlocks/rogers/ListElements", () => ({
  ListTitle: ({ title }: { title: string }) => (
    <div data-testid="list-title">{title}</div>
  ),
}));

describe("AntennaInventoryPage", () => {
  const mockProps: {
    antennaNotes: Note[];
    antennaInventory: AntennaTransmissionLine[];
    tocSections: TOCSections[];
    willCaptureToc: boolean;
  } = {
    antennaNotes: [
      { id: "1", indexNumber: 1, comment: "sample comment" },
      { id: "2", indexNumber: 2, comment: "sample comment" },
    ],
    antennaInventory: [
      {
        id: "1",
        elevation: "100",
        equipment: "Test Equipment",
        quantity: "1",
        azimuth: "180",
        tx_line: "Test Line",
        odu: "Test ODU",
        carrier: "Test Carrier",
        projectId: "1",
      },
    ],
    tocSections: [
      {
        title: "Antenna and Transmission Line Inventory",
        pageNumber: 1,
      },
    ],
    willCaptureToc: true,
  };

  const renderComponent = (component: React.ReactElement) => {
    return render(component);
  };

  it("renders without crashing", () => {
    const { container } = renderComponent(
      <AntennaInventoryPage {...mockProps} />,
    );

    expect(container).toBeTruthy();
  });

  it("renders TOC section with correct props", () => {
    const { getByTestId } = renderComponent(
      <AntennaInventoryPage {...mockProps} />,
    );
    const tocSection = getByTestId("toc-section");

    expect(tocSection).toHaveTextContent(
      "Antenna and Transmission Line Inventory",
    );
  });

  it("renders antenna inventory table", () => {
    const { getByTestId } = renderComponent(
      <AntennaInventoryPage {...mockProps} />,
    );

    expect(getByTestId("antenna-inventory-table")).toBeInTheDocument();
  });

  it("renders notes section", () => {
    const { getByTestId } = renderComponent(
      <AntennaInventoryPage {...mockProps} />,
    );

    expect(getByTestId("list-title")).toHaveTextContent("Notes:");
    expect(getByTestId("page-notes")).toBeInTheDocument();
  });

  it("handles empty notes array", () => {
    const propsWithEmptyNotes = {
      ...mockProps,
      antennaNotes: [],
    };
    const { getByTestId } = renderComponent(
      <AntennaInventoryPage {...propsWithEmptyNotes} />,
    );

    expect(getByTestId("page-notes")).toBeInTheDocument();
  });

  it("handles empty inventory array", () => {
    const propsWithEmptyInventory = {
      ...mockProps,
      antennaInventory: [],
    };
    const { getByTestId } = renderComponent(
      <AntennaInventoryPage {...propsWithEmptyInventory} />,
    );

    expect(getByTestId("antenna-inventory-table")).toBeInTheDocument();
  });
});
