import React from "react";
import { render } from "@testing-library/react";

import { FiscalMonths } from "@/generated/client";
import { MonthlyAppsUsageBoard } from "@/src/components/rnd/tracking/apps/MonthlyAppsUsageBoard";
import { MonthlyDataTable } from "@/src/components/rnd/tracking/MonthlyDataTable";
import { AppGroup } from "@/src/interfaces/rnd";
import { getFiscalMonths } from "@/src/components/rnd/tracking/getFiscalMonths";

// Mock MonthlyDataTable to verify props
jest.mock("@/components/rnd/tracking/MonthlyDataTable", () => ({
  MonthlyDataTable: jest.fn(() => (
    <div data-testid="monthly-data-table">Monthly Data Table</div>
  )),
}));

describe("MonthlyAppsUsageBoard", () => {
  // Reset mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with actual monthly usage data when available", () => {
    // Create a mock item with monthly usage data
    const mockItem: AppGroup = {
      id: "1",
      app_name: "Test App",
      count: 100,
      endpoint: "/api/test",
      min_time: "10ms",
      max_time: "500ms",
      avg_time: "100ms",
      total_time: "10000ms",
      monthlyUsage: [
        { month: FiscalMonths.January, count: 10 },
        { month: FiscalMonths.February, count: 20 },
        { month: FiscalMonths.March, count: 30 },
      ],
    };

    render(<MonthlyAppsUsageBoard item={mockItem} />);

    // Get the mock calls and verify the props
    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({
        data: mockItem.monthlyUsage,
        total: 60, // 10 + 20 + 30
        tableAriaLabel: "monthly-usage-table",
        valueField: "count",
      }),
    );
  });

  it("generates placeholder data when monthlyUsage is not available", () => {
    // Create a mock item without monthly usage data
    const mockItem: AppGroup = {
      id: "1",
      app_name: "Test App",
      count: 100,
      endpoint: "/api/test",
      min_time: "10ms",
      max_time: "500ms",
      avg_time: "100ms",
      total_time: "10000ms",
    };

    render(<MonthlyAppsUsageBoard item={mockItem} />);

    // Expect MonthlyDataTable to be called with placeholder data
    const expectedPlaceholderData = getFiscalMonths.map((month) => ({
      month,
      count: 0,
    }));

    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({
        data: expectedPlaceholderData,
        total: 0, // All months have count 0
        tableAriaLabel: "monthly-usage-table",
      }),
    );
  });

  it("correctly calculates the total usage", () => {
    // Create a mock item with monthly usage data
    const mockItem: AppGroup = {
      id: "1",
      app_name: "Test App",
      count: 100,
      endpoint: "/api/test",
      min_time: "10ms",
      max_time: "500ms",
      avg_time: "100ms",
      total_time: "10000ms",
      monthlyUsage: [
        { month: FiscalMonths.January, count: 15 },
        { month: FiscalMonths.February, count: 25 },
        { month: FiscalMonths.March, count: 35 },
        { month: FiscalMonths.April, count: 45 },
      ],
    };

    render(<MonthlyAppsUsageBoard item={mockItem} />);

    // Verify that total is calculated correctly (15 + 25 + 35 + 45 = 120)
    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({
        total: 120,
      }),
    );
  });

  it("applies correct table styles", () => {
    const mockItem: AppGroup = {
      id: "1",
      app_name: "Test App",
      count: 100,
      endpoint: "/api/test",
      min_time: "10ms",
      max_time: "500ms",
      avg_time: "100ms",
      total_time: "10000ms",
    };

    render(<MonthlyAppsUsageBoard item={mockItem} />);

    // Verify that the table styles are correctly passed
    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({
        tableStyles: {
          base: "text-center",
          header: "bg-primary text-background",
        },
      }),
    );
  });

  it("handles empty monthlyUsage array", () => {
    // Create a mock item with an empty monthlyUsage array
    const mockItem: AppGroup = {
      id: "1",
      app_name: "Test App",
      count: 100,
      endpoint: "/api/test",
      min_time: "10ms",
      max_time: "500ms",
      avg_time: "100ms",
      total_time: "10000ms",
      monthlyUsage: [],
    };

    render(<MonthlyAppsUsageBoard item={mockItem} />);

    // Expect MonthlyDataTable to be called with placeholder data
    const expectedPlaceholderData = getFiscalMonths.map((month) => ({
      month,
      count: 0,
    }));

    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({
        data: expectedPlaceholderData,
        total: 0,
      }),
    );
  });
});
