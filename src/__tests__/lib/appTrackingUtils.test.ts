import { groupByAppName } from "@/src/lib/appTrackingUtils";
import { AppUsageTracking } from "@/interfaces/rnd";

describe("appTrackingUtils", () => {
  describe("groupByAppName", () => {
    it("should group records by app name correctly", () => {
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
          app_name: "app1",
          task_id: "task2",
          endpoint: "/api/endpoint1",
          status: "SUCCESS",
          elapsed_time: "2.5s",
          createdAt: new Date(),
        },
        {
          id: "3",
          app_name: "app2",
          task_id: "task3",
          endpoint: "/api/endpoint2",
          status: "SUCCESS",
          elapsed_time: "3.0s",
          createdAt: new Date(),
        },
      ];

      const result = groupByAppName(mockRecords);

      expect(result).toHaveLength(2);

      // Check app1 group
      const app1Group = result.find((g) => g.app_name === "app1");

      expect(app1Group).toBeDefined();
      expect(app1Group).toEqual({
        app_name: "app1",
        count: 2,
        total_time: "4s",
        min_time: "1.5s",
        max_time: "2.5s",
        avg_time: "2.00s",
        id: "1",
        endpoint: "/api/endpoint1",
      });

      // Check app2 group
      const app2Group = result.find((g) => g.app_name === "app2");

      expect(app2Group).toBeDefined();
      expect(app2Group).toEqual({
        app_name: "app2",
        count: 1,
        total_time: "3s",
        min_time: "3s",
        max_time: "3s",
        avg_time: "3.00s",
        id: "3",
        endpoint: "/api/endpoint2",
      });
    });

    it("should handle empty records array", () => {
      const result = groupByAppName([]);

      expect(result).toEqual([]);
    });

    it("should throw error for inconsistent endpoints", () => {
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
          app_name: "app1",
          task_id: "task2",
          endpoint: "/api/different-endpoint",
          status: "SUCCESS",
          elapsed_time: "2.5s",
          createdAt: new Date(),
        },
      ];

      expect(() => groupByAppName(mockRecords)).toThrow(
        "Inconsistent endpoint for app 'app1'",
      );
    });

    it("should handle single decimal precision in elapsed time", () => {
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
      ];

      const result = groupByAppName(mockRecords);

      expect(result[0].avg_time).toBe("1.50s");
    });

    it("should handle zero elapsed time", () => {
      const mockRecords: AppUsageTracking[] = [
        {
          id: "1",
          app_name: "app1",
          task_id: "task1",
          endpoint: "/api/endpoint1",
          status: "SUCCESS",
          elapsed_time: "0s",
          createdAt: new Date(),
        },
      ];

      const result = groupByAppName(mockRecords);

      expect(result[0]).toEqual({
        app_name: "app1",
        count: 1,
        total_time: "0s",
        min_time: "0s",
        max_time: "0s",
        avg_time: "0.00s",
        id: "1",
        endpoint: "/api/endpoint1",
      });
    });
  });
});
