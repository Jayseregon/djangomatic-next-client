import React from "react";
import { render, screen } from "@testing-library/react";
import { FiscalMonths } from "@prisma/client";
// Import external packages before internal imports
import * as HeroUI from "@heroui/react";

import { MonthlyDataTable } from "@/src/components/rnd/tracking/MonthlyDataTable";
import { getFiscalMonths } from "@/src/components/rnd/tracking/getFiscalMonths";
import { MonthlyData } from "@/interfaces/rnd";

// Mock the entire HeroUI module
jest.mock("@heroui/react", () => {
  // Store rendered cells for testing
  const renderedCells: any[] = [];
  const renderedTableProps: any = {};

  return {
    // Mock Table component
    Table: jest.fn((props) => {
      // Store props for later assertions
      Object.assign(renderedTableProps, props);

      return (
        <div className="w-full">
          <div className="overflow-x-auto">
            <table aria-label={props["aria-label"]}>{props.children}</table>
          </div>
        </div>
      );
    }),
    TableBody: jest.fn(({ children }) => <tbody>{children}</tbody>),
    TableHeader: jest.fn(({ children }) => (
      <thead>
        <tr>{children}</tr>
      </thead>
    )),
    TableColumn: jest.fn(({ children, className }) => (
      <th className={className}>{children}</th>
    )),
    TableRow: jest.fn(({ children }) => <tr>{children}</tr>),
    // Mock TableCell with tracking of rendered values
    TableCell: jest.fn((props) => {
      renderedCells.push(props);

      return (
        <td
          className={props.className}
          data-testid={`cell-${props.children}`}
          onClick={props.onClick ? () => props.onClick() : undefined}
        >
          {props.children}
        </td>
      );
    }),
    // Expose test helpers for assertions
    __renderedCells: renderedCells,
    __renderedTableProps: renderedTableProps,
    __clearMocks: () => {
      renderedCells.length = 0;
      Object.keys(renderedTableProps).forEach(
        (key) => delete renderedTableProps[key],
      );
    },
  };
});

// Mock data for testing
const mockData: MonthlyData[] = [
  { month: FiscalMonths.July, count: 10 },
  { month: FiscalMonths.August, count: 20 },
  { month: FiscalMonths.September, count: 30 },
];

describe("MonthlyDataTable", () => {
  beforeEach(() => {
    // Clear stored props between tests
    (HeroUI as any).__clearMocks();
  });

  it("renders the table with data correctly", () => {
    render(<MonthlyDataTable data={mockData} total={60} />);

    // Check if all months are rendered in the header
    getFiscalMonths.forEach((month) => {
      expect(screen.getByText(month)).toBeInTheDocument();
    });

    // Check total is rendered
    expect(screen.getByText("60")).toBeInTheDocument();

    // Check cells using our tracked rendered cells
    const cells = (HeroUI as any).__renderedCells;

    // Find specific cells
    const julyCell = cells.find(
      (cell: { children: string }) => cell.children === "10",
    );
    const augustCell = cells.find(
      (cell: { children: string }) => cell.children === "20",
    );
    const septemberCell = cells.find(
      (cell: { children: string }) => cell.children === "30",
    );
    const totalCell = cells.find(
      (cell: { children: string }) => cell.children === "60",
    );

    // Verify cells were rendered
    expect(julyCell).toBeDefined();
    expect(augustCell).toBeDefined();
    expect(septemberCell).toBeDefined();
    expect(totalCell).toBeDefined();
  });

  it("displays loading content when isLoading is true", () => {
    const customLoadingContent = (
      <div data-testid="custom-loader">Custom Loading...</div>
    );

    render(
      <MonthlyDataTable
        data={mockData}
        isLoading={true}
        loadingContent={customLoadingContent}
        total={60}
      />,
    );

    expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
    expect(screen.queryByText("July")).not.toBeInTheDocument();
  });

  it("displays default loading content when isLoading is true and no loading content provided", () => {
    render(<MonthlyDataTable data={mockData} isLoading={true} total={60} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays empty content when data is empty", () => {
    const customEmptyContent = "No data available for this period";

    render(
      <MonthlyDataTable
        data={[]}
        emptyContent={customEmptyContent}
        total={0}
      />,
    );

    expect(screen.getByText(customEmptyContent)).toBeInTheDocument();
  });

  it("uses custom value formatting", () => {
    const customFormat = (value: number) => `$${value.toFixed(2)}`;

    render(
      <MonthlyDataTable
        data={mockData}
        total={60}
        totalFormat={customFormat}
        valueFormat={customFormat}
      />,
    );

    // Check cells using our tracked rendered cells
    const cells = (HeroUI as any).__renderedCells;

    // Find formatted cells
    const julyCell = cells.find(
      (cell: { children: string }) => cell.children === "$10.00",
    );
    const augustCell = cells.find(
      (cell: { children: string }) => cell.children === "$20.00",
    );
    const septemberCell = cells.find(
      (cell: { children: string }) => cell.children === "$30.00",
    );
    const totalCell = cells.find(
      (cell: { children: string }) => cell.children === "$60.00",
    );

    // Verify cells were rendered with formatted values
    expect(julyCell).toBeDefined();
    expect(augustCell).toBeDefined();
    expect(septemberCell).toBeDefined();
    expect(totalCell).toBeDefined();
  });

  it("uses custom value field", () => {
    const customData: MonthlyData[] = [
      { month: FiscalMonths.July, customValue: 15 },
      { month: FiscalMonths.August, customValue: 25 },
      { month: FiscalMonths.September, customValue: 35 },
    ];

    render(
      <MonthlyDataTable
        data={customData}
        total={75}
        valueField="customValue"
      />,
    );

    // Check cells using our tracked rendered cells
    const cells = (HeroUI as any).__renderedCells;

    // Find specific cells with custom value field
    const julyCell = cells.find(
      (cell: { children: string }) => cell.children === "15",
    );
    const augustCell = cells.find(
      (cell: { children: string }) => cell.children === "25",
    );
    const septemberCell = cells.find(
      (cell: { children: string }) => cell.children === "35",
    );

    // Verify cells were rendered with custom values
    expect(julyCell).toBeDefined();
    expect(augustCell).toBeDefined();
    expect(septemberCell).toBeDefined();
  });

  it("handles cell clicks when cells are editable", () => {
    const handleCellClick = jest.fn();

    render(
      <MonthlyDataTable
        data={mockData}
        isCellEditable={true}
        total={60}
        onCellClick={handleCellClick}
      />,
    );

    // Find the cell with July data
    const cells = (HeroUI as any).__renderedCells;
    const julyCell = cells.find(
      (cell: { children: string }) => cell.children === "10",
    );

    // Verify the onClick handler is defined when cells are editable
    expect(julyCell.onClick).toBeDefined();

    // Simulate click
    julyCell.onClick();

    // Verify the callback was called with correct data
    expect(handleCellClick).toHaveBeenCalledWith({
      month: FiscalMonths.July,
      value: 10,
      originalData: mockData[0],
    });
  });

  it("does not trigger cell clicks when cells are not editable", () => {
    const handleCellClick = jest.fn();

    render(
      <MonthlyDataTable
        data={mockData}
        isCellEditable={false}
        total={60}
        onCellClick={handleCellClick}
      />,
    );

    // Find the cell with July data
    const cells = (HeroUI as any).__renderedCells;
    const julyCell = cells.find(
      (cell: { children: string }) => cell.children === "10",
    );

    // Verify the onClick handler is not defined when cells are not editable
    expect(julyCell.onClick).toBeUndefined();
  });

  it("renders dash for months with no data or zero values", () => {
    const sparseData: MonthlyData[] = [
      { month: FiscalMonths.July, count: 10 },
      { month: FiscalMonths.October, count: 30 },
    ];

    render(<MonthlyDataTable data={sparseData} total={40} />);

    // Check cells using our tracked rendered cells
    const cells = (HeroUI as any).__renderedCells;

    // Count the number of dash cells
    const dashCells = cells.filter(
      (cell: { children: string }) => cell.children === "-",
    );

    // Should be 10 months with dashes (12 months - 2 with values)
    expect(dashCells.length).toBe(10);

    // Verify cells with values are correctly rendered
    const julyCell = cells.find(
      (cell: { children: string }) => cell.children === "10",
    );
    const octoberCell = cells.find(
      (cell: { children: string }) => cell.children === "30",
    );

    expect(julyCell).toBeDefined();
    expect(octoberCell).toBeDefined();
  });

  it("applies custom table styles", () => {
    const customTableStyles = {
      base: "custom-base-class",
      header: "custom-header-class",
    };

    render(
      <MonthlyDataTable
        data={mockData}
        tableStyles={customTableStyles}
        total={60}
      />,
    );

    // Check if Table was called with correct props
    const tableProps = (HeroUI as any).__renderedTableProps;

    // Verify that custom styles were passed correctly
    expect(tableProps.classNames).toEqual({
      base: "custom-base-class",
      th: "custom-header-class",
    });
  });
});
