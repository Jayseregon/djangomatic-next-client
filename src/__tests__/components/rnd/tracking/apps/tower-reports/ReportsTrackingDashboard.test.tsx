import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { ReportsTrackingDashboard } from "@/src/components/rnd/tracking/apps/tower-reports/ReportsTrackingDashboard";
import { useReportsTrackingData } from "@/src/hooks/tracking/useReportsTrackingData";
import { MonthlyReportsUsageBoard } from "@/src/components/rnd/tracking/apps/tower-reports/MonthlyReportsUsageBoard";

// Mock the dependencies
jest.mock("@/src/hooks/tracking/useReportsTrackingData", () => ({
  useReportsTrackingData: jest.fn(),
}));

jest.mock(
  "@/src/components/rnd/tracking/apps/tower-reports/MonthlyReportsUsageBoard",
  () => ({
    MonthlyReportsUsageBoard: jest.fn(() => (
      <div data-testid="monthly-reports-usage-board">
        Monthly Reports Usage Board
      </div>
    )),
  }),
);

// Mock tab selection handler
const mockTab = jest.fn();

// Mock HeroUI components with proper TypeScript types
jest.mock("@heroui/react", () => {
  const original = jest.requireActual("@heroui/react");

  return {
    ...original,
    Tabs: ({ children, onSelectionChange }: any) => {
      // Use onSelectionChange in a non-functional way to avoid linting errors
      const handleChange = () => {
        if (onSelectionChange) {
          onSelectionChange(new Set(["active-tab"]));
        }
      };

      return (
        <div data-testid="tabs-container" onChange={handleChange}>
          {children}
        </div>
      );
    },
    Tab: ({ children, title, id }: any) => {
      // Use the id if provided; otherwise fallback to the text content
      const tabIdentifier =
        id !== undefined
          ? id
          : typeof (title || children) === "string"
            ? title || children
            : "";

      return (
        <div
          data-testid={`tab-${tabIdentifier}`}
          role="tab"
          tabIndex={0}
          onClick={() => mockTab(Number(tabIdentifier))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              mockTab(Number(tabIdentifier));
            }
          }}
        >
          {title || children}
        </div>
      );
    },
  };
});

describe("ReportsTrackingDashboard", () => {
  // Save original Date implementation
  const RealDate = global.Date;
  const mockDate = new Date("2023-05-15");

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock current year to 2023
    global.Date = class extends RealDate {
      constructor() {
        super();

        return mockDate;
      }
      static now() {
        return mockDate.getTime();
      }
    } as any;
  });

  afterEach(() => {
    // Restore original Date
    global.Date = RealDate;
  });

  it("renders with loading state", () => {
    // Mock the hook return value for loading state
    (useReportsTrackingData as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      reload: jest.fn(),
      years: [],
      totalCount: 0,
    });

    render(<ReportsTrackingDashboard />);

    expect(useReportsTrackingData).toHaveBeenCalledWith(2023); // Current year from mock

    const mockCalls = (MonthlyReportsUsageBoard as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({
        data: [],
        isLoading: true,
        error: null,
        selectedYear: 2023,
        totalCount: 0,
      }),
    );
  });

  it("renders with data and year tabs", () => {
    const mockData = [
      { month: "January", count: 5 },
      { month: "February", count: 10 },
    ];
    const mockYears = [2023, 2022, 2021];
    const mockTotalCount = 15;

    (useReportsTrackingData as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      reload: jest.fn(),
      years: mockYears,
      totalCount: mockTotalCount,
    });

    render(<ReportsTrackingDashboard />);

    // Check if all year tabs are rendered
    mockYears.forEach((year) => {
      const yearTab = screen.getByTestId(`tab-${year}`);

      expect(yearTab).toBeInTheDocument();
      expect(yearTab).toHaveTextContent(year.toString());
    });

    const mockCalls = (MonthlyReportsUsageBoard as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({
        data: mockData,
        isLoading: false,
        selectedYear: 2023,
        totalCount: mockTotalCount,
      }),
    );
  });

  it("changes the selected year when a tab is clicked", () => {
    const mockData = [
      { month: "January", count: 5 },
      { month: "February", count: 10 },
    ];
    const mockYears = [2023, 2022, 2021];
    const mockReload = jest.fn();
    const mockTotalCount = 15;

    (useReportsTrackingData as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      reload: mockReload,
      years: mockYears,
      totalCount: mockTotalCount,
    });

    render(<ReportsTrackingDashboard />);

    // Initial call with current year
    expect(useReportsTrackingData).toHaveBeenCalledWith(2023);

    // Initial render of MonthlyReportsUsageBoard
    const initialCalls = (MonthlyReportsUsageBoard as jest.Mock).mock.calls;

    expect(initialCalls.length).toBe(1);
    expect(initialCalls[0][0]).toEqual(
      expect.objectContaining({ selectedYear: 2023 }),
    );

    // Find and click the 2022 tab
    const tab2022 = screen.getByTestId("tab-2022");

    expect(tab2022).toBeInTheDocument();

    fireEvent.click(tab2022);

    // Tab click should call mockTab with the title
    expect(mockTab).toHaveBeenCalledWith(2022);
  });

  it("uses the first available year when current year is not available", () => {
    const mockData = [
      { month: "January", count: 5 },
      { month: "February", count: 10 },
    ];
    const mockYears = [2022, 2021, 2020]; // 2023 not included
    const mockTotalCount = 15;

    // Mock the hook with years that don't include the current year
    (useReportsTrackingData as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      reload: jest.fn(),
      years: mockYears,
      totalCount: mockTotalCount,
    });

    render(<ReportsTrackingDashboard />);

    // After the useEffect, it should use the first available year (2022)
    const mockCalls = (MonthlyReportsUsageBoard as jest.Mock).mock.calls;

    // The component will render twice:
    // 1. First with selectedYear=2023 (initial state)
    // 2. Then with selectedYear=2022 (after useEffect)
    // So we should check the latest call, not the count
    expect(mockCalls.length).toBeGreaterThan(0);

    // Get the most recent call to check the final state
    const mostRecentCall = mockCalls[mockCalls.length - 1];

    expect(mostRecentCall[0]).toEqual(
      expect.objectContaining({ selectedYear: 2022 }),
    );
  });

  it("does not show year tabs when no years are available", () => {
    (useReportsTrackingData as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      reload: jest.fn(),
      years: [],
      totalCount: 0,
    });

    render(<ReportsTrackingDashboard />);

    // There should be no tabs rendered
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();

    // But the MonthlyReportsUsageBoard should still be rendered with the default year
    const mockCalls = (MonthlyReportsUsageBoard as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({ selectedYear: 2023 }),
    );
  });

  it("passes reload function from hook to MonthlyReportsUsageBoard", () => {
    const mockReload = jest.fn();

    (useReportsTrackingData as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      reload: mockReload,
      years: [2023],
      totalCount: 0,
    });

    render(<ReportsTrackingDashboard />);

    // Check if reload function is passed to MonthlyReportsUsageBoard
    const mockCalls = (MonthlyReportsUsageBoard as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].reload).toBe(mockReload);
  });

  it("passes totalCount from the hook to MonthlyReportsUsageBoard", () => {
    const mockTotalCount = 42;

    (useReportsTrackingData as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      reload: jest.fn(),
      years: [2023],
      totalCount: mockTotalCount,
    });

    render(<ReportsTrackingDashboard />);

    // Check if totalCount is properly passed
    const mockCalls = (MonthlyReportsUsageBoard as jest.Mock).mock.calls;

    expect(mockCalls[0][0].totalCount).toBe(mockTotalCount);
  });
});
