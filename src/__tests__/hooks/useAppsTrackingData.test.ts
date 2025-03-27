import { renderHook, act } from "@testing-library/react";

import { useAppsTrackingData } from "@/src/hooks/tracking/useAppsTrackingData";
import { getAppTrackingEntries } from "@/src/actions/prisma/tracking/action";
import { AppUsageTracking } from "@/interfaces/rnd";
import { getFiscalMonths } from "@/src/components/rnd/tracking/getFiscalMonths";

// Mock the action module
jest.mock("@/src/actions/prisma/tracking/action", () => ({
  getAppTrackingEntries: jest.fn(),
}));

describe("useAppsTrackingData", () => {
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  // Create mock data with different years for testing
  const mockAppRecords: AppUsageTracking[] = [
    {
      id: "1",
      app_name: "app1",
      task_id: "task1",
      endpoint: "/api/endpoint1",
      status: "SUCCESS",
      elapsed_time: "1.5s",
      createdAt: new Date(`${currentYear}-01-15`),
    },
    {
      id: "2",
      app_name: "app1",
      task_id: "task2",
      endpoint: "/api/endpoint1",
      status: "SUCCESS",
      elapsed_time: "2.0s",
      createdAt: new Date(`${lastYear}-06-20`),
    },
    {
      id: "3",
      app_name: "app2",
      task_id: "task3",
      endpoint: "/api/endpoint2",
      status: "SUCCESS",
      elapsed_time: "1.0s",
      createdAt: new Date(`${currentYear}-03-10`),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load app tracking data successfully", async () => {
    (getAppTrackingEntries as jest.Mock).mockResolvedValueOnce(mockAppRecords);

    const { result } = renderHook(() => useAppsTrackingData());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual([]);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data.length).toBeGreaterThan(0);
    expect(getAppTrackingEntries).toHaveBeenCalled();

    // Verify years array contains both years from the data
    expect(result.current.years).toContain(currentYear);
    expect(result.current.years).toContain(lastYear);
    expect(result.current.years).toEqual([currentYear, lastYear]);
  });

  it("should handle error when loading app records", async () => {
    (getAppTrackingEntries as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch app records"),
    );

    const { result } = renderHook(() => useAppsTrackingData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Failed to fetch app records");
    expect(result.current.data).toEqual([]);
  });

  it("should handle null app records", async () => {
    (getAppTrackingEntries as jest.Mock).mockResolvedValueOnce(null);

    const { result } = renderHook(() => useAppsTrackingData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("No app records found");
    expect(result.current.data).toEqual([]);
  });

  it("should reload app tracking data", async () => {
    const updatedMockRecords = [
      ...mockAppRecords,
      {
        id: "4",
        app_name: "app3",
        task_id: "task4",
        endpoint: "/api/endpoint3",
        status: "SUCCESS",
        elapsed_time: "3.0s",
        createdAt: new Date(`${currentYear}-05-15`),
      },
    ];

    (getAppTrackingEntries as jest.Mock)
      .mockResolvedValueOnce(mockAppRecords)
      .mockResolvedValueOnce(updatedMockRecords);

    const { result } = renderHook(() => useAppsTrackingData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.reload();
    });

    expect(getAppTrackingEntries).toHaveBeenCalledTimes(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data.length).toBe(3); // app1, app2, app3
  });

  it("should sort data by app_name", async () => {
    const unsortedRecords = [
      {
        id: "1",
        app_name: "zapp",
        task_id: "task1",
        endpoint: "/api/endpoint1",
        status: "SUCCESS",
        elapsed_time: "1.5s",
        createdAt: new Date(),
      },
      {
        id: "2",
        app_name: "aapp",
        task_id: "task2",
        endpoint: "/api/endpoint2",
        status: "SUCCESS",
        elapsed_time: "2.0s",
        createdAt: new Date(),
      },
    ];

    (getAppTrackingEntries as jest.Mock).mockResolvedValueOnce(unsortedRecords);

    const { result } = renderHook(() => useAppsTrackingData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.data[0].app_name).toBe("aapp");
    expect(result.current.data[1].app_name).toBe("zapp");
  });

  it("should filter data by year", async () => {
    (getAppTrackingEntries as jest.Mock).mockResolvedValueOnce(mockAppRecords);

    const { result } = renderHook(() => useAppsTrackingData(currentYear));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Should only include apps with usage in the current year
    expect(result.current.data.length).toBe(2);
    expect(result.current.data.some((app) => app.app_name === "app1")).toBe(
      true,
    );
    expect(result.current.data.some((app) => app.app_name === "app2")).toBe(
      true,
    );

    // Check monthly usage data is attached
    expect(result.current.data[0].monthlyUsage).toBeDefined();
    expect(result.current.data[0].monthlyUsage?.length).toBe(
      getFiscalMonths.length,
    );

    // Find January entry (should have count = 1 for app1 in current year)
    const januaryData = result.current.data[0].monthlyUsage?.find(
      (m) => m.month === "January",
    );

    expect(januaryData?.count).toBe(1);
  });

  it("should filter out apps with no usage in specified year", async () => {
    const differentYearRecords = [
      {
        id: "1",
        app_name: "app1",
        task_id: "task1",
        endpoint: "/api/endpoint1",
        status: "SUCCESS",
        elapsed_time: "1.5s",
        createdAt: new Date(`${currentYear}-01-15`),
      },
      {
        id: "2",
        app_name: "app2",
        task_id: "task2",
        endpoint: "/api/endpoint2",
        status: "SUCCESS",
        elapsed_time: "2.0s",
        createdAt: new Date(`${lastYear}-06-20`),
      },
    ];

    (getAppTrackingEntries as jest.Mock).mockResolvedValueOnce(
      differentYearRecords,
    );

    // Filter for last year
    const { result } = renderHook(() => useAppsTrackingData(lastYear));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Should only include app2 which has usage in the last year
    expect(result.current.data.length).toBe(1);
    expect(result.current.data[0].app_name).toBe("app2");
  });
});
