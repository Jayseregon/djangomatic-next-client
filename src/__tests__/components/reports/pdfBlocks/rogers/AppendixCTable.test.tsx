import React from "react";
import { render } from "@testing-library/react";

import AppendixCTable from "@/components/reports/pdfBlocks/rogers/AppendixCTable";
import { ChecklistRow, ListItem } from "@/src/interfaces/reports";

// Mock @react-pdf/renderer - include StyleSheet.create
jest.mock("@react-pdf/renderer", () => ({
  View: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div data-testid="pdf-view" style={style}>
      {children}
    </div>
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

// Mock the child components
jest.mock("@/components/reports/pdfBlocks/rogers/AppendixCHeader", () => ({
  __esModule: true,
  default: () => <div data-testid="appendix-c-header">Header Mock</div>,
}));

jest.mock("@/components/reports/pdfBlocks/rogers/AppendixCRow", () => ({
  __esModule: true,
  default: ({ items, list }: { items: ChecklistRow[]; list: ListItem[] }) => (
    <div data-testid="appendix-c-row">
      Row Mock - Items: {items.length}, List: {list.length}
    </div>
  ),
}));

jest.mock("@/components/reports/pdfBlocks/rogers/AppendixCTopHeader", () => ({
  __esModule: true,
  default: ({
    formNb,
    title,
    type,
  }: {
    formNb: string;
    title: string;
    type: string;
  }) => (
    <div data-testid="appendix-c-top-header">
      Top Header Mock - Form: {formNb}, Title: {title}, Type: {type}
    </div>
  ),
}));

describe("AppendixCTable", () => {
  const mockProps = {
    items: [
      { id: "1", code: "A1", isChecked: true, comments: "Test comment 1" },
      { id: "2", code: "A2", isChecked: false, comments: "Test comment 2" },
    ] as ChecklistRow[],
    list: [
      { code: "A1", item: "Test Item 1" },
      { code: "A2", item: "Test Item 2" },
    ] as ListItem[],
    formNb: "4",
    type: "Civil",
    title: "Test Form",
  };

  it("renders without crashing", () => {
    const { container } = render(<AppendixCTable {...mockProps} />);

    expect(container).toBeTruthy();
  });

  it("renders all child components", () => {
    const { getByTestId } = render(<AppendixCTable {...mockProps} />);

    expect(getByTestId("appendix-c-top-header")).toBeInTheDocument();
    expect(getByTestId("appendix-c-header")).toBeInTheDocument();
    expect(getByTestId("appendix-c-row")).toBeInTheDocument();
  });

  it("passes correct props to AppendixCTopHeader", () => {
    const { getByTestId } = render(<AppendixCTable {...mockProps} />);
    const topHeader = getByTestId("appendix-c-top-header");

    expect(topHeader.textContent).toContain(`Form: ${mockProps.formNb}`);
    expect(topHeader.textContent).toContain(`Title: ${mockProps.title}`);
    expect(topHeader.textContent).toContain(`Type: ${mockProps.type}`);
  });

  it("passes correct props to AppendixCRow", () => {
    const { getByTestId } = render(<AppendixCTable {...mockProps} />);
    const row = getByTestId("appendix-c-row");

    expect(row.textContent).toContain(`Items: ${mockProps.items.length}`);
    expect(row.textContent).toContain(`List: ${mockProps.list.length}`);
  });

  it("applies correct container styles", () => {
    const { getByTestId } = render(<AppendixCTable {...mockProps} />);
    const container = getByTestId("pdf-view");

    // The container should have the tableContainer style from StylesPDF
    expect(container).toBeInTheDocument();
  });

  it("handles empty items and list", () => {
    const emptyProps = {
      ...mockProps,
      items: [],
      list: [],
    };

    const { getByTestId } = render(<AppendixCTable {...emptyProps} />);
    const row = getByTestId("appendix-c-row");

    expect(row.textContent).toContain("Items: 0");
    expect(row.textContent).toContain("List: 0");
  });
});
