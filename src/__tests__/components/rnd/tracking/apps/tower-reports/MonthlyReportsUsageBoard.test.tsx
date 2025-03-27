import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { MonthlyReportsUsageBoard } from "@/src/components/rnd/tracking/apps/tower-reports/MonthlyReportsUsageBoard";
import { MonthlyDataTable } from "@/src/components/rnd/tracking/MonthlyDataTable";
import { LoadingContent } from "@/components/ui/LoadingContent";

// Mock LoadingContent
jest.mock("@/components/ui/LoadingContent", () => ({
  LoadingContent: jest.fn(() => (
    <div data-testid="loading-content">Loading...</div>
  )),
}));

// Improved MonthlyDataTable mock that renders topContent
jest.mock("@/components/rnd/tracking/MonthlyDataTable", () => ({
  MonthlyDataTable: jest.fn(({ topContent }) => (
    <div data-testid="monthly-data-table">
      {topContent}
      <div>Monthly Data Table</div>
    </div>
  )),
}));

describe("MonthlyReportsUsageBoard", () => {
  // Reset mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    data: [
      { month: "January", count: 10 },
      { month: "February", count: 20 },
      { month: "March", count: 30 },
    ],
    isLoading: false,
    error: null,
    reload: jest.fn(),
    selectedYear: 2023,
    totalCount: 60,
  };

  it("renders correctly with data", () => {
    render(<MonthlyReportsUsageBoard {...defaultProps} />);

    // Verify the MonthlyDataTable is called with correct props
    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({
        data: defaultProps.data,
        emptyContent: "No reports found",
        isLoading: false,
        tableAriaLabel: "tower-report-tracking-board",
        total: defaultProps.totalCount,
        valueField: "count",
      }),
    );

    // Verify table styles
    expect(mockCalls[0][0].tableStyles).toEqual({
      base: "text-center",
      header: "uppercase bg-foreground text-background",
    });
  });

  it("passes loading state and content to MonthlyDataTable", () => {
    render(<MonthlyReportsUsageBoard {...defaultProps} isLoading={true} />);

    // Check that loading props are passed correctly
    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;

    expect(mockCalls[0][0].isLoading).toBe(true);

    // Verify LoadingContent is passed as a prop (not called directly)
    const loadingContent = mockCalls[0][0].loadingContent;

    expect(loadingContent).toBeDefined();
    expect(loadingContent.type).toBe(LoadingContent);
  });

  it("displays the selected year and total count", () => {
    render(<MonthlyReportsUsageBoard {...defaultProps} />);

    // Check that the text containing the year and count is rendered
    const yearText = screen.getByText(
      `Showing ${defaultProps.totalCount} reports for ${defaultProps.selectedYear}`,
    );

    expect(yearText).toBeInTheDocument();
  });

  it("does not display the year and count when selectedYear is not provided", () => {
    const propsWithoutYear = { ...defaultProps, selectedYear: undefined };

    render(<MonthlyReportsUsageBoard {...propsWithoutYear} />);

    // Ensure the text is not present
    const yearText = screen.queryByText(
      new RegExp(`Showing ${defaultProps.totalCount} reports for`),
    );

    expect(yearText).not.toBeInTheDocument();
  });

  it("calls reload function when refresh button is clicked", () => {
    render(<MonthlyReportsUsageBoard {...defaultProps} />);

    // Find the refresh button and click it (the Button component is mocked to have a button role)
    const refreshButton = screen.getByRole("button");

    fireEvent.click(refreshButton);

    // Verify reload was called
    expect(defaultProps.reload).toHaveBeenCalledTimes(1);
  });

  it("throws error when error prop is provided", () => {
    // Mock console.error to prevent test output noise
    const originalConsoleError = console.error;

    console.error = jest.fn();

    const errorMessage = "Test error message";

    // Use a try-catch to verify error is thrown
    expect(() => {
      render(
        <MonthlyReportsUsageBoard {...defaultProps} error={errorMessage} />,
      );
    }).toThrow(errorMessage);

    // Restore console.error
    console.error = originalConsoleError;
  });

  it("handles empty data array", () => {
    render(
      <MonthlyReportsUsageBoard {...defaultProps} data={[]} totalCount={0} />,
    );

    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;

    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({
        data: [],
        total: 0,
        emptyContent: "No reports found",
      }),
    );
  });

  it("passes the topContent with refresh button to MonthlyDataTable", () => {
    render(<MonthlyReportsUsageBoard {...defaultProps} />);

    const mockCalls = (MonthlyDataTable as jest.Mock).mock.calls;

    // Verify topContent is defined and rendered in the document
    expect(mockCalls[0][0].topContent).toBeDefined();
  });
});
