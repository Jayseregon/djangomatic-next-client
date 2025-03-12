import { renderHook, act } from "@testing-library/react";

import { useAppTrackingData } from "@/src/hooks/useAppTrackingData";
import {
  getAppTrackingEntries,
  getPciReportsEntries,
} from "@/src/actions/prisma/tracking/action";
import { AppUsageTracking } from "@/interfaces/rnd";
import { TowerReport } from "@/interfaces/reports";

// Mock the action module
jest.mock("@/src/actions/prisma/tracking/action", () => ({
  getAppTrackingEntries: jest.fn(),
  getPciReportsEntries: jest.fn(),
}));

describe("useAppTrackingData", () => {
  const mockAppRecords: AppUsageTracking[] = [
    {
      id: "1",
      app_name: "app1",
      task_id: "task1",
      endpoint: "/api/endpoint1",
      status: "SUCCESS",
      elapsed_time: "1.5s",
      createdAt: new Date(),
    },
  ];

  const mockPciReports: Partial<TowerReport>[] = [
    {
      id: "pci1",
      createdAt: new Date(),
      updatedAt: new Date(),
      site_name: "Site 1",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load both app tracking and PCI reports data successfully", async () => {
    (getAppTrackingEntries as jest.Mock).mockResolvedValueOnce(mockAppRecords);
    (getPciReportsEntries as jest.Mock).mockResolvedValueOnce(mockPciReports);

    const { result } = renderHook(() => useAppTrackingData());

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
    expect(getPciReportsEntries).toHaveBeenCalled();
  });

  it("should handle error when loading PCI reports", async () => {
    (getAppTrackingEntries as jest.Mock).mockResolvedValueOnce(mockAppRecords);
    (getPciReportsEntries as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch PCI reports"),
    );

    const { result } = renderHook(() => useAppTrackingData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Failed to fetch PCI reports");
    expect(result.current.data).toEqual([]);
  });

  it("should handle null PCI reports", async () => {
    (getAppTrackingEntries as jest.Mock).mockResolvedValueOnce(mockAppRecords);
    (getPciReportsEntries as jest.Mock).mockResolvedValueOnce(null);

    const { result } = renderHook(() => useAppTrackingData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("No PCI reports found");
    expect(result.current.data).toEqual([]);
  });

  it("should reload both app tracking and PCI reports data", async () => {
    const updatedMockPciReports = [
      ...mockPciReports,
      { id: "pci2", createdAt: new Date(), updatedAt: new Date() },
    ];

    (getAppTrackingEntries as jest.Mock)
      .mockResolvedValueOnce(mockAppRecords)
      .mockResolvedValueOnce(mockAppRecords);

    (getPciReportsEntries as jest.Mock)
      .mockResolvedValueOnce(mockPciReports)
      .mockResolvedValueOnce(updatedMockPciReports);

    const { result } = renderHook(() => useAppTrackingData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.reload();
    });

    expect(getAppTrackingEntries).toHaveBeenCalledTimes(2);
    expect(getPciReportsEntries).toHaveBeenCalledTimes(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  // Keep existing sort test but remove redundant tests...
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
    (getPciReportsEntries as jest.Mock).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useAppTrackingData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Filter out PCI Reports entry before checking the sort order
    const appTrackingData = result.current.data.filter(
      (item) => item.app_name !== "PCI Reports",
    );

    expect(appTrackingData[0].app_name).toBe("aapp");
    expect(appTrackingData[1].app_name).toBe("zapp");
  });
});
