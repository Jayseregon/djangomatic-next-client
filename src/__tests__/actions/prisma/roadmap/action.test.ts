import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prismaClient";
import {
  createRoadmapCardCategory,
  getRoadmapCardCategories,
  getRoadmapCards,
  createRoadmapProject,
  deletegRoadmapProject,
  updateCardPositions,
} from "@/actions/prisma/roadmap/action";

// Mock the prisma client
jest.mock("@/lib/prismaClient", () => ({
  prisma: {
    roadmapCardCategory: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    roadmapCard: {
      findMany: jest.fn(),
    },
    roadmapProject: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
    roadmapProjectCard: {
      deleteMany: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}));

// Mock next/cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Roadmap Actions", () => {
  const mockConsoleError = jest.spyOn(console, "error").mockImplementation();
  const mockConsoleLog = jest.spyOn(console, "log").mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockConsoleError.mockClear();
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
    mockConsoleLog.mockRestore();
  });

  describe("createRoadmapCardCategory", () => {
    it("should create a category with capitalized name", async () => {
      await createRoadmapCardCategory("test category");

      expect(prisma.roadmapCardCategory.create).toHaveBeenCalledWith({
        data: { name: "Test Category" },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });

    it("should handle errors gracefully", async () => {
      const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
      const error = new Error("Database error");

      (prisma.roadmapCardCategory.create as jest.Mock).mockRejectedValueOnce(
        error,
      );

      await createRoadmapCardCategory("test");

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Error creating category:",
        error,
      );
      consoleLogSpy.mockRestore();
    });
  });

  describe("getRoadmapCardCategories", () => {
    it("should return all categories", async () => {
      const mockCategories = [{ id: "1", name: "Category 1" }];

      (prisma.roadmapCardCategory.findMany as jest.Mock).mockResolvedValueOnce(
        mockCategories,
      );

      const result = await getRoadmapCardCategories();

      expect(result).toEqual(mockCategories);
    });
  });

  describe("getRoadmapCards", () => {
    it("should return cards with related data", async () => {
      const mockCards = [
        {
          id: "1",
          title: "Card 1",
          projectCards: [],
          category: { id: "1", name: "Category 1" },
        },
      ];

      (prisma.roadmapCard.findMany as jest.Mock).mockResolvedValueOnce(
        mockCards,
      );

      const result = await getRoadmapCards();

      expect(result).toEqual(mockCards);
    });
  });

  describe("createRoadmapProject", () => {
    it("should create a project with default position", async () => {
      const mockProject = { id: "1", name: "New Project", position: 0 };

      (prisma.roadmapProject.create as jest.Mock).mockResolvedValueOnce(
        mockProject,
      );

      const result = await createRoadmapProject("New Project");

      expect(result).toEqual(mockProject);
      expect(prisma.roadmapProject.create).toHaveBeenCalledWith({
        data: { name: "New Project", position: 0 },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });

    it("should create a project with specified position", async () => {
      await createRoadmapProject("New Project", 5);

      expect(prisma.roadmapProject.create).toHaveBeenCalledWith({
        data: { name: "New Project", position: 5 },
      });
    });
  });

  describe("deletegRoadmapProject", () => {
    it("should delete project and related cards", async () => {
      await deletegRoadmapProject("1");

      expect(prisma.roadmapProjectCard.deleteMany).toHaveBeenCalledWith({
        where: { projectId: "1" },
      });
      expect(prisma.roadmapProject.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });
  });

  describe("updateCardPositions", () => {
    const mockUpdates = [
      { projectId: "1", cardId: "card1", position: 0 },
      { projectId: "1", cardId: "card2", position: 1 },
    ];

    it("should update positions and return updated project", async () => {
      const mockProject = {
        id: "1",
        name: "Project",
        projectCards: [
          { cardId: "card1", position: 0 },
          { cardId: "card2", position: 1 },
        ],
      };

      (prisma.roadmapProject.findUnique as jest.Mock).mockResolvedValueOnce(
        mockProject,
      );

      const result = await updateCardPositions(mockUpdates);

      expect(result).toEqual(mockProject);
      expect(prisma.roadmapProjectCard.update).toHaveBeenCalledTimes(2);
      expect(revalidatePath).toHaveBeenCalledWith("/boards/roadmap");
      expect(revalidatePath).toHaveBeenCalledWith("/boards/roadmap/projects/1");
    });

    it("should throw error if no project ID provided", async () => {
      await expect(updateCardPositions([])).rejects.toThrow(
        "No project ID provided",
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Error updating card positions:",
        expect.any(Error),
      );
    });

    it("should throw error if project not found", async () => {
      (prisma.roadmapProject.findUnique as jest.Mock).mockResolvedValueOnce(
        null,
      );

      await expect(updateCardPositions(mockUpdates)).rejects.toThrow(
        "Project not found",
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Error updating card positions:",
        expect.any(Error),
      );
    });
  });
});
