import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";

import { AppTrackingBoard } from "@/src/components/rnd/tracking/AppTrackingBoard";
import { useAppTrackingData } from "@/src/hooks/useAppTrackingData";

// Mock the hooks and dependencies
jest.mock("@/src/hooks/useAppTrackingData");
jest.mock("lucide-react", () => ({
  RefreshCcw: () => <div data-testid="refresh-icon">RefreshIcon</div>,
}));
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("AppTrackingBoard", () => {
  const mockReload = jest.fn();

  const mockData = [
    {
      id: "1",
      app_name: "Test App 1",
      count: 5,
      endpoint: "/api/test1",
      avg_time: "1.5s",
      min_time: "1.0s",
      max_time: "2.0s",
      total_time: "7.5s",
    },
    {
      id: "2",
      app_name: "Test App 2",
      count: 3,
      endpoint: "/api/test2",
      avg_time: "2.0s",
      min_time: "1.5s",
      max_time: "2.5s",
      total_time: "6.0s",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppTrackingData as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      reload: mockReload,
    });
  });

  it("renders loading state correctly", () => {
    (useAppTrackingData as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      reload: mockReload,
    });

    render(<AppTrackingBoard />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders data correctly", async () => {
    render(<AppTrackingBoard />);

    await waitFor(() => {
      expect(screen.getByText("Test App 1")).toBeInTheDocument();
      expect(screen.getByText("Test App 2")).toBeInTheDocument();
    });

    // Verify column headers
    expect(screen.getByText("appName")).toBeInTheDocument();
    expect(screen.getByText("usageCount")).toBeInTheDocument();
    expect(screen.getByText("endpoint")).toBeInTheDocument();
    expect(screen.getByText("average")).toBeInTheDocument();
    expect(screen.getByText("min")).toBeInTheDocument();
    expect(screen.getByText("max")).toBeInTheDocument();
    expect(screen.getByText("total")).toBeInTheDocument();

    // Verify data cells using more specific queries
    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1]; // First row after header

    expect(firstDataRow).toHaveTextContent("/api/test1");
    expect(firstDataRow).toHaveTextContent("7.5s");

    // Verify specific cells in the first row
    const firstRowCells = firstDataRow.querySelectorAll("td");

    expect(firstRowCells[0]).toHaveTextContent("Test App 1");
    expect(firstRowCells[3]).toHaveTextContent("1.5s"); // avg_time
    expect(firstRowCells[6]).toHaveTextContent("7.5s"); // total_time
  });

  it("handles reload button click", async () => {
    render(<AppTrackingBoard />);

    const refreshButton = screen.getByRole("button");

    fireEvent.click(refreshButton);

    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it("throws error when error state is present", () => {
    (useAppTrackingData as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: "Test error",
      reload: mockReload,
    });

    expect(() => render(<AppTrackingBoard />)).toThrow("Test error");
  });

  it("displays empty state when no data", async () => {
    (useAppTrackingData as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      reload: mockReload,
    });

    render(<AppTrackingBoard />);

    await waitFor(() => {
      expect(screen.getByText("No entries found")).toBeInTheDocument();
    });
  });

  it("renders refresh button with icon", () => {
    render(<AppTrackingBoard />);

    expect(screen.getByTestId("refresh-icon")).toBeInTheDocument();
  });

  it("renders table with correct class names", () => {
    render(<AppTrackingBoard />);

    // Find the div with className "text-center" that contains the table
    const tableContainer = screen.getByRole("table").closest(".text-center");

    expect(tableContainer).toHaveClass("text-center");
  });
});
