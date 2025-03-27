import React from "react";
import { render } from "@testing-library/react";
import { FiscalMonths, GainTrackingStatus } from "@prisma/client";

import { MonthlyGainsCostBoard } from "@/src/components/rnd/tracking/gains/MonthlyGainsCostBoard";
import { MonthlyDataTable } from "@/src/components/rnd/tracking/MonthlyDataTable";
import { EditCostModal } from "@/src/components/rnd/tracking/gains/EditCostModal";
import { GainsTrackingRecordItem } from "@/src/interfaces/rnd";
import { getFiscalMonths } from "@/src/components/rnd/tracking/getFiscalMonths";

// Mock dependencies
jest.mock("@/components/rnd/tracking/MonthlyDataTable", () => ({
  MonthlyDataTable: jest.fn(() => (
    <div data-testid="monthly-data-table">Monthly Data Table</div>
  )),
}));

jest.mock("@/components/rnd/tracking/gains/EditCostModal", () => ({
  EditCostModal: jest.fn(() => (
    <div data-testid="edit-cost-modal">Edit Cost Modal</div>
  )),
}));

// Mock useDisclosure hook from HeroUI
jest.mock("@heroui/react", () => ({
  ...jest.requireActual("@heroui/react"),
  useDisclosure: jest.fn(() => ({
    isOpen: false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
  })),
}));

describe("MonthlyGainsCostBoard", () => {
  // Reset mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Create a basic mock record
  const createMockRecord = (withCosts = true): GainsTrackingRecordItem => ({
    id: "1",
    createdAt: new Date("2023-01-01"),
    taskId: "task-1",
    name: "Test Task",
    hasGains: true,
    replaceOffshore: false,
    timeInitial: 100,
    timeSaved: 50,
    status: GainTrackingStatus.OPEN,
    monthlyCosts: withCosts
      ? [
          {
            id: "cost-1",
            gainsRecordId: "1",
            fiscalYear: 2023,
            month: FiscalMonths.January,
            cost: 1000,
            count: 10,
            rate: 100,
            adjustedCost: 0,
          },
          {
            id: "cost-2",
            gainsRecordId: "1",
            fiscalYear: 2023,
            month: FiscalMonths.February,
            cost: 2000,
            count: 20,
            rate: 100,
            adjustedCost: 0,
          },
        ]
      : [],
  });

  it("renders with monthly cost data when available", () => {
    const mockRecord = createMockRecord();

    render(<MonthlyGainsCostBoard record={mockRecord} />);

    // Verify MonthlyDataTable props
    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);

    // Check if data is correctly passed
    const passedProps = mockCalls[0][0];

    expect(passedProps).toEqual(
      expect.objectContaining({
        tableAriaLabel: "monthly-costs-table",
        tableStyles: {
          base: "text-center",
          header: "bg-primary text-background",
        },
        total: 3000, // 1000 + 2000
        valueField: "cost",
      }),
    );

    // Verify that all months are represented in the data
    expect(passedProps.data.length).toBe(12); // All fiscal months
  });

  it("generates placeholder data when monthlyCosts is empty", () => {
    const mockRecord = createMockRecord(false);

    render(<MonthlyGainsCostBoard record={mockRecord} />);

    // Verify MonthlyDataTable props
    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);

    // Check if empty data is correctly generated
    const passedProps = mockCalls[0][0];

    // Expected data: one entry per month with 0 cost
    const expectedData = getFiscalMonths.map((month) => ({
      month,
      cost: 0,
    }));

    expect(passedProps.data).toEqual(expectedData);
    expect(passedProps.total).toBe(0);
  });

  it("formats costs as currency values", () => {
    const mockRecord = createMockRecord();

    render(<MonthlyGainsCostBoard record={mockRecord} />);

    // Get MonthlyDataTable props
    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;
    const passedProps = mockCalls[0][0];

    // Test the value formatter
    const formattedValue = passedProps.valueFormat(1234);

    expect(formattedValue).toBe("$1,234");

    // Test the total formatter
    const formattedTotal = passedProps.totalFormat(5678);

    expect(formattedTotal).toBe("$5,678");
  });

  it("enables cell editing when onUpdateMonthlyCost is provided", () => {
    const mockRecord = createMockRecord();
    const mockUpdateHandler = jest.fn();

    render(
      <MonthlyGainsCostBoard
        record={mockRecord}
        onUpdateMonthlyCost={mockUpdateHandler}
      />,
    );

    // Get MonthlyDataTable props
    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;
    const passedProps = mockCalls[0][0];

    // Verify that cells are editable when handler is provided
    expect(passedProps.isCellEditable).toBe(true);
  });

  it("disables cell editing when onUpdateMonthlyCost is not provided", () => {
    const mockRecord = createMockRecord();

    render(<MonthlyGainsCostBoard record={mockRecord} />);

    // Get MonthlyDataTable props
    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;
    const passedProps = mockCalls[0][0];

    // Verify that cells are not editable when handler is missing
    expect(passedProps.isCellEditable).toBe(false);
  });

  it("passes onCellClick handler to MonthlyDataTable", () => {
    const mockRecord = createMockRecord();
    const mockUpdateHandler = jest.fn();

    render(
      <MonthlyGainsCostBoard
        record={mockRecord}
        onUpdateMonthlyCost={mockUpdateHandler}
      />,
    );

    // Get MonthlyDataTable props
    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;
    const passedProps = mockCalls[0][0];

    // Verify onCellClick handler is passed
    expect(typeof passedProps.onCellClick).toBe("function");
  });

  it("passes the isLoading prop to MonthlyDataTable", () => {
    const mockRecord = createMockRecord();

    render(<MonthlyGainsCostBoard isLoading={true} record={mockRecord} />);

    // Get MonthlyDataTable props
    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;
    const passedProps = mockCalls[0][0];

    // Verify isLoading is passed through
    expect(passedProps.isLoading).toBe(true);
  });

  it("renders EditCostModal", () => {
    const mockRecord = createMockRecord();

    render(<MonthlyGainsCostBoard record={mockRecord} />);

    // Verify EditCostModal is rendered
    const mockModalCalls = (EditCostModal as jest.Mock).mock.calls;

    expect(mockModalCalls.length).toBe(1);

    // Check if the required props are passed
    const modalProps = mockModalCalls[0][0];

    expect(modalProps).toHaveProperty("count");
    expect(modalProps).toHaveProperty("rate");
    expect(modalProps).toHaveProperty("adjustedCost");
    expect(modalProps).toHaveProperty("subtotal");
    expect(modalProps).toHaveProperty("grandTotal");
    expect(modalProps).toHaveProperty("onSave");
    expect(modalProps).toHaveProperty("onClose");
  });
});
