import { renderHook, act } from "@testing-library/react";

import { useAppTrackingData } from "@/src/hooks/useAppTrackingData";
import { getAppTrackingEntries } from "@/src/actions/prisma/tracking/action";
import { AppUsageTracking } from "@/interfaces/rnd";

// Mock the action module
jest.mock("@/src/actions/prisma/tracking/action", () => ({
  getAppTrackingEntries: jest.fn(),
}));

describe("useAppTrackingData", () => {
  const mockRecords: AppUsageTracking[] = [
    {
      id: "1",
      app_name: "app1",
      task_id: "task1",
      endpoint: "/api/endpoint1",
      status: "SUCCESS",
      elapsed_time: "1.5s",
      createdAt: new Date(),
    },
    {
      id: "2",
      app_name: "app2",
      task_id: "task2",
      endpoint: "/api/endpoint2",
      status: "SUCCESS",
      elapsed_time: "2.0s",
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load data successfully", async () => {
    (getAppTrackingEntries as jest.Mock).mockResolvedValueOnce(mockRecords);

    const { result } = renderHook(() => useAppTrackingData());

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual([]);

    // Wait for data to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Check final state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0]).toMatchObject({
      app_name: "app1",
      count: 1,
      endpoint: "/api/endpoint1",
    });
  });

  it("should handle error when loading data", async () => {
    const error = new Error("Failed to fetch data");

    (getAppTrackingEntries as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useAppTrackingData());

    // Wait for error to be caught
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Failed to fetch data");
    expect(result.current.data).toEqual([]);
  });

  it("should handle null records", async () => {
    (getAppTrackingEntries as jest.Mock).mockResolvedValueOnce(null);

    const { result } = renderHook(() => useAppTrackingData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("No records found");
    expect(result.current.data).toEqual([]);
  });

  it("should reload data when reload function is called", async () => {
    (getAppTrackingEntries as jest.Mock)
      .mockResolvedValueOnce(mockRecords)
      .mockResolvedValueOnce([
        ...mockRecords,
        {
          id: "3",
          app_name: "app3",
          task_id: "task3",
          endpoint: "/api/endpoint3",
          status: "SUCCESS",
          elapsed_time: "3.0s",
          createdAt: new Date(),
        },
      ]);

    const { result } = renderHook(() => useAppTrackingData());

    // Wait for initial load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.data).toHaveLength(2);

    // Call reload
    await act(async () => {
      await result.current.reload();
    });

    expect(getAppTrackingEntries).toHaveBeenCalledTimes(2);
    expect(result.current.data).toHaveLength(3);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
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

    const { result } = renderHook(() => useAppTrackingData());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.data[0].app_name).toBe("aapp");
    expect(result.current.data[1].app_name).toBe("zapp");
  });
});
