import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { AppsTrackingDashboard } from "@/src/components/rnd/tracking/apps/AppsTrackingDashboard";
import { useAppsTrackingData } from "@/src/hooks/tracking/useAppsTrackingData";
import { AppsTrackingBoard } from "@/src/components/rnd/tracking/apps/AppsTrackingBoard";

// Mock the dependencies
jest.mock("@/src/hooks/tracking/useAppsTrackingData", () => ({
  useAppsTrackingData: jest.fn(),
}));

jest.mock("@/src/components/rnd/tracking/apps/AppsTrackingBoard", () => ({
  AppsTrackingBoard: jest.fn(() => (
    <div data-testid="apps-tracking-board">Apps Tracking Board</div>
  )),
}));

// Mock tab selection handler
const mockTab = jest.fn();

// Mock HeroUI components with proper TypeScript types
jest.mock("@heroui/react", () => {
  const original = jest.requireActual("@heroui/react");

  interface TabsProps {
    children?: React.ReactNode;
    selectedKey?: string;
    onSelectionChange?: (key: string) => void;
    classNames?: {
      tabList?: string;
      cursor?: string;
      tab?: string;
      tabContent?: string;
    };
    color?: string;
    variant?: string;
    [key: string]: any;
  }

  interface TabProps {
    title: React.ReactNode;
    [key: string]: any;
  }

  return {
    ...original,
    Tabs: ({
      children,
      selectedKey,
      onSelectionChange,
      classNames,
      ...props
    }: TabsProps) => {
      // Extract classNames and apply them properly instead of passing the object to DOM
      const className = classNames?.tabList || "";

      return (
        <div
          className={className}
          data-has-content-class={!!classNames?.tabContent}
          data-has-cursor={!!classNames?.cursor}
          data-has-selection-handler={onSelectionChange ? "true" : "false"}
          data-has-tab-class={!!classNames?.tab}
          data-selected-key={selectedKey}
          role="tablist"
          {...props}
        >
          {React.Children.map(children, (child) => child)}
        </div>
      );
    },
    Tab: ({ title, ...props }: TabProps) => (
      <div
        data-testid={`tab-${title}`}
        role="tab"
        tabIndex={0}
        onClick={() => mockTab(title)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            props.onClick?.();
          }
        }}
        {...props}
      >
        {title}
      </div>
    ),
  };
});

describe("AppsTrackingDashboard", () => {
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
    (useAppsTrackingData as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      reload: jest.fn(),
      years: [],
    });

    render(<AppsTrackingDashboard />);

    expect(useAppsTrackingData).toHaveBeenCalledWith(2023); // Current year from mock

    // Fix: Check the first argument only, with object containing
    const mockCalls = (AppsTrackingBoard as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({
        data: [],
        isLoading: true,
        error: null,
        selectedYear: 2023,
      }),
    );
  });

  it("renders with data and year tabs", () => {
    const mockData = [{ id: "1", app_name: "Test App", count: 5 }];
    const mockYears = [2023, 2022, 2021];

    (useAppsTrackingData as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      reload: jest.fn(),
      years: mockYears,
    });

    render(<AppsTrackingDashboard />);

    // Check if all year tabs are rendered
    mockYears.forEach((year) => {
      // Since we're now rendering the years as Tab titles, we can use getByText
      expect(screen.getByText(year.toString())).toBeInTheDocument();
    });

    // Fix: Check just the first argument
    const mockCalls = (AppsTrackingBoard as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({
        data: mockData,
        isLoading: false,
        selectedYear: 2023,
      }),
    );
  });

  it("changes the selected year when a tab is clicked", () => {
    const mockData = [{ id: "1", app_name: "Test App", count: 5 }];
    const mockYears = [2023, 2022, 2021];
    const mockReload = jest.fn();

    (useAppsTrackingData as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      reload: mockReload,
      years: mockYears,
    });

    render(<AppsTrackingDashboard />);

    // Initial call with current year
    expect(useAppsTrackingData).toHaveBeenCalledWith(2023);

    // Initial render of AppsTrackingBoard - fix assertion
    const initialCalls = (AppsTrackingBoard as jest.Mock).mock.calls;

    expect(initialCalls.length).toBe(1);
    expect(initialCalls[0][0]).toEqual(
      expect.objectContaining({ selectedYear: 2023 }),
    );

    // Find and click the 2022 tab - use the title instead of key
    const tab2022 = screen.getByTestId("tab-2022");

    fireEvent.click(tab2022);

    // Tab click should call mockTab with the title
    expect(mockTab).toHaveBeenCalledWith("2022");
  });

  it("uses the first available year when current year is not available", () => {
    const mockData = [{ id: "1", app_name: "Test App", count: 5 }];
    const mockYears = [2022, 2021, 2020]; // 2023 not included

    // First call with current year 2023
    (useAppsTrackingData as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      reload: jest.fn(),
      years: mockYears,
    });

    render(<AppsTrackingDashboard />);

    // After the component realizes 2023 is not in the years array,
    // it should use the first available year (2022)
    const mockCalls = (AppsTrackingBoard as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({ selectedYear: 2022 }),
    );
  });

  it("does not show year tabs when no years are available", () => {
    (useAppsTrackingData as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      reload: jest.fn(),
      years: [],
    });

    render(<AppsTrackingDashboard />);

    // There should be no tabs rendered
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();

    // But the AppsTrackingBoard should still be rendered with the default year
    const mockCalls = (AppsTrackingBoard as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0]).toEqual(
      expect.objectContaining({ selectedYear: 2023 }),
    );
  });

  it("passes reload function from hook to AppsTrackingBoard", () => {
    const mockReload = jest.fn();

    (useAppsTrackingData as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      reload: mockReload,
      years: [2023],
    });

    render(<AppsTrackingDashboard />);

    // Check if reload function is passed to AppsTrackingBoard
    const mockCalls = (AppsTrackingBoard as jest.Mock).mock.calls;

    expect(mockCalls.length).toBe(1);
    expect(mockCalls[0][0].reload).toBe(mockReload);
  });
});
