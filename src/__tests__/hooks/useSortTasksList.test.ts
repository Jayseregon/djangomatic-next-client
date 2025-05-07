import { renderHook } from "@testing-library/react";

import { Status } from "@/generated/client";
import { useSortTasksList } from "@/hooks/useSortTasksList";
import { RnDTeamTask } from "@/interfaces/lib";
import * as rndTaskActions from "@/src/actions/prisma/rndTask/action";

// Mock the server action
jest.mock("@/src/actions/prisma/rndTask/action", () => ({
  getRndTasksByOwnerId: jest.fn(),
}));

// Mock console.error so we can test it was called correctly
const originalConsoleError = console.error;

console.error = jest.fn();

interface LoadParams {
  signal?: AbortSignal;
}

interface SortDescriptor {
  column: keyof RnDTeamTask;
  direction: "ascending" | "descending";
}

interface SortParams {
  items: RnDTeamTask[];
  sortDescriptor: SortDescriptor | null;
}

interface AsyncListResponse {
  items: RnDTeamTask[];
}

interface AsyncListData {
  items: RnDTeamTask[];
  load: (params: LoadParams) => Promise<AsyncListResponse>;
  sort: (params: SortParams) => Promise<AsyncListResponse>;
}

jest.mock("@react-stately/data", () => ({
  useAsyncList: jest.fn(
    (props): AsyncListData => ({
      items: [],
      load: async (params: LoadParams) => props.load(params),
      sort: async (params: SortParams) => props.sort(params),
    }),
  ),
}));

describe("useSortTasksList", () => {
  const mockTasks: RnDTeamTask[] = [
    {
      id: "1",
      createdAt: new Date("2024-01-01"),
      owner: {} as any,
      task: "Task A",
      priority: 1,
      impactedPeople: "Team A",
      status: Status.IN_PROGRESS,
      dueDate: new Date("2024-02-01"),
      startedAt: new Date("2024-01-15"),
      completedAt: undefined,
      trackGains: true,
    },
    {
      id: "2",
      createdAt: new Date("2024-01-02"),
      owner: {} as any,
      task: "Task B",
      priority: 2,
      impactedPeople: "Team B",
      status: Status.COMPLETED,
      dueDate: new Date("2024-02-15"),
      startedAt: new Date("2024-01-20"),
      completedAt: new Date("2024-01-25"),
      trackGains: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the server action to return our mock data
    (rndTaskActions.getRndTasksByOwnerId as jest.Mock).mockResolvedValue(
      mockTasks,
    );
    // Clear the console.error mock
    (console.error as jest.Mock).mockClear();
  });

  afterAll(() => {
    // Restore original console.error after tests
    console.error = originalConsoleError;
  });

  it("should call getRndTasksByOwnerId with correct id", async () => {
    const { result } = renderHook(() => useSortTasksList("user-123", false));
    const hook = result.current as unknown as AsyncListData;

    await hook.load({});

    expect(rndTaskActions.getRndTasksByOwnerId).toHaveBeenCalledWith(
      "user-123",
    );
  });

  it("should load and filter active tasks when showCompleted is false", async () => {
    const { result } = renderHook(() => useSortTasksList("user-123", false));
    const hook = result.current as unknown as AsyncListData;
    const response = await hook.load({});

    expect(response.items).toEqual(
      mockTasks.filter(
        (task) =>
          task.status !== Status.COMPLETED && task.status !== Status.CANCELLED,
      ),
    );
  });

  it("should load and filter completed tasks when showCompleted is true", async () => {
    const { result } = renderHook(() => useSortTasksList("user-123", true));
    const hook = result.current as unknown as AsyncListData;
    const response = await hook.load({});

    expect(response.items).toEqual(
      mockTasks.filter(
        (task) =>
          task.status === Status.COMPLETED || task.status === Status.CANCELLED,
      ),
    );
  });

  it("should sort numeric fields correctly", async () => {
    const { result } = renderHook(() => useSortTasksList("user-123", false));
    const hook = result.current as unknown as AsyncListData;

    const sortResult = await hook.sort({
      items: mockTasks,
      sortDescriptor: { column: "priority", direction: "ascending" },
    });

    expect(sortResult.items[0].priority).toBe(1);
    expect(sortResult.items[1].priority).toBe(2);
  });

  it("should sort string fields correctly", async () => {
    const { result } = renderHook(() => useSortTasksList("user-123", false));
    const hook = result.current as unknown as AsyncListData;

    const sortResult = await hook.sort({
      items: mockTasks,
      sortDescriptor: { column: "task", direction: "ascending" },
    });

    expect(sortResult.items[0].task).toBe("Task A");
    expect(sortResult.items[1].task).toBe("Task B");
  });

  it("should sort date fields correctly", async () => {
    const { result } = renderHook(() => useSortTasksList("user-123", false));
    const hook = result.current as unknown as AsyncListData;

    const sortResult = await hook.sort({
      items: mockTasks,
      sortDescriptor: { column: "createdAt", direction: "ascending" },
    });

    expect(sortResult.items[0].createdAt).toEqual(new Date("2024-01-01"));
    expect(sortResult.items[1].createdAt).toEqual(new Date("2024-01-02"));
  });

  it("should handle missing sort descriptor", async () => {
    const { result } = renderHook(() => useSortTasksList("user-123", false));
    const hook = result.current as unknown as AsyncListData;

    const sortResult = await hook.sort({
      items: mockTasks,
      sortDescriptor: null,
    });

    expect(sortResult.items).toEqual(mockTasks);
  });

  it("should handle API errors gracefully", async () => {
    // Mock the server action to throw an error
    const errorMessage = "API Error";

    (rndTaskActions.getRndTasksByOwnerId as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    const { result } = renderHook(() => useSortTasksList("user-123", false));
    const hook = result.current as unknown as AsyncListData;

    const response = await hook.load({});

    // Check that we get an empty array when there's an error
    expect(response.items).toEqual([]);
    // Verify the error was logged
    expect(console.error).toHaveBeenCalledWith(
      "Error loading tasks:",
      expect.objectContaining({ message: errorMessage }),
    );
  });
});
