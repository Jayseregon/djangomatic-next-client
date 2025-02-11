jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/src/lib/prismaClient", () => {
  const mockPrisma = {
    appUsageTracking: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  return { prisma: mockPrisma };
});

import {
  getAppTrackingEntries,
  createAppTrackingEntry,
  updateAppTrackingEntry,
} from "@/src/actions/prisma/tracking/action";
import { prisma } from "@/src/lib/prismaClient";

describe("App Tracking Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAppTrackingEntries", () => {
    it("should fetch tracking entries successfully", async () => {
      const mockEntries = [
        { id: "1", status: "SUCCESS" },
        { id: "2", status: "SUCCESS" },
      ];

      (prisma.appUsageTracking.findMany as jest.Mock).mockResolvedValue(
        mockEntries,
      );

      const result = await getAppTrackingEntries();

      expect(prisma.appUsageTracking.findMany).toHaveBeenCalledWith({
        where: { status: "SUCCESS" },
      });
      expect(result).toEqual(mockEntries);
    });

    it("should handle errors when fetching entries", async () => {
      (prisma.appUsageTracking.findMany as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await expect(getAppTrackingEntries()).rejects.toThrow(
        "Error fetching tracking entries: Database error",
      );
    });
  });

  describe("createAppTrackingEntry", () => {
    const mockData = {
      task_id: "task123",
      app_name: "testApp",
      endpoint: "/api/test",
    };

    it("should create tracking entry successfully", async () => {
      const mockEntry = { id: "new-id", ...mockData };

      (prisma.appUsageTracking.create as jest.Mock).mockResolvedValue(
        mockEntry,
      );

      const result = await createAppTrackingEntry(
        mockData.task_id,
        mockData.app_name,
        mockData.endpoint,
      );

      expect(prisma.appUsageTracking.create).toHaveBeenCalledWith({
        data: {
          task_id: mockData.task_id,
          app_name: mockData.app_name,
          endpoint: mockData.endpoint,
        },
      });
      expect(result).toBe("new-id");
    });

    it("should handle validation errors", async () => {
      (prisma.appUsageTracking.create as jest.Mock).mockRejectedValue(
        new Error("Error creating new tracking entry"),
      );

      await expect(
        createAppTrackingEntry(
          undefined as unknown as string,
          mockData.app_name,
          mockData.endpoint,
        ),
      ).rejects.toThrow("Error creating new tracking entry");
    });

    it("should handle database errors", async () => {
      (prisma.appUsageTracking.create as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await expect(
        createAppTrackingEntry(
          mockData.task_id,
          mockData.app_name,
          mockData.endpoint,
        ),
      ).rejects.toThrow("Error creating new tracking entry: Database error");
    });
  });

  describe("updateAppTrackingEntry", () => {
    const mockData = {
      task_id: "task123",
      entryId: "entry123",
      status: "SUCCESS",
      elapsed_time: "1.5s",
    };

    it("should update tracking entry successfully", async () => {
      const mockUpdatedEntry = {
        id: mockData.entryId,
        task_id: mockData.task_id,
        status: mockData.status,
        elapsed_time: mockData.elapsed_time,
      };

      (prisma.appUsageTracking.update as jest.Mock).mockResolvedValue(
        mockUpdatedEntry,
      );

      await updateAppTrackingEntry(
        mockData.task_id,
        mockData.entryId,
        mockData.status,
        mockData.elapsed_time,
      );

      expect(prisma.appUsageTracking.update).toHaveBeenCalledWith({
        where: {
          id: mockData.entryId,
          task_id: mockData.task_id,
        },
        data: {
          status: mockData.status,
          elapsed_time: mockData.elapsed_time,
        },
      });
    });

    it("should handle validation errors", async () => {
      (prisma.appUsageTracking.update as jest.Mock).mockRejectedValue(
        new Error("Error updating tracking entry"),
      );

      await expect(
        updateAppTrackingEntry(
          mockData.task_id,
          mockData.entryId,
          undefined as unknown as string,
          mockData.elapsed_time,
        ),
      ).rejects.toThrow("Error updating tracking entry");
    });

    it("should handle database errors", async () => {
      (prisma.appUsageTracking.update as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await expect(
        updateAppTrackingEntry(
          mockData.task_id,
          mockData.entryId,
          mockData.status,
          mockData.elapsed_time,
        ),
      ).rejects.toThrow("Error updating tracking entry: Database error");
    });
  });
});
