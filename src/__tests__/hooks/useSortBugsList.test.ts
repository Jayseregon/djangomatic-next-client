import { renderHook } from "@testing-library/react";

import { useSortBugsList } from "@/hooks/useSortBugsList";
import { BugReport, BugStatus, BugPriority } from "@/interfaces/bugs";

// Define proper interfaces for AsyncList types
interface LoadParams {
  signal?: AbortSignal;
}

interface SortDescriptor {
  column: keyof BugReport;
  direction: "ascending" | "descending";
}

interface SortParams {
  items: BugReport[];
  sortDescriptor: SortDescriptor | null;
}

interface AsyncListResponse {
  items: BugReport[];
}

interface AsyncListData {
  items: BugReport[];
  load: (params: LoadParams) => Promise<AsyncListResponse>;
  sort: (params: SortParams) => Promise<AsyncListResponse>;
}

// Update the mock with proper types
jest.mock("@react-stately/data", () => ({
  useAsyncList: jest.fn(
    (props): AsyncListData => ({
      items: [],
      load: async (params: LoadParams) => props.load(params),
      sort: async (params: SortParams) => props.sort(params),
    }),
  ),
}));

describe("useSortBugsList", () => {
  const mockBugs: BugReport[] = [
    {
      id: "1",
      title: "Bug A",
      description: "First bug",
      createdDate: new Date("2024-01-01"),
      createdBy: "user1",
      status: BugStatus.OPEN,
      priority: BugPriority.HIGH,
      assignedTo: "user2",
      assignedDate: new Date("2024-01-02"),
      completedDate: undefined,
      comments: "Test comment",
    },
    {
      id: "2",
      title: "Bug B",
      description: "Second bug",
      createdDate: new Date("2024-01-02"),
      createdBy: "user2",
      status: BugStatus.CLOSED,
      priority: BugPriority.LOW,
      assignedTo: "user1",
      assignedDate: new Date("2024-01-03"),
      completedDate: new Date("2024-01-04"),
      comments: "Another comment",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(async () =>
      Promise.resolve({
        json: () => Promise.resolve(mockBugs),
      }),
    ) as jest.Mock;
  });

  it("should make API call with correct endpoint", async () => {
    const { result } = renderHook(() =>
      useSortBugsList("/api/custom-bugs", false),
    );
    const hook = result.current as unknown as AsyncListData;
    const abortController = new AbortController();

    await hook.load({ signal: abortController.signal });

    expect(fetch).toHaveBeenCalledWith("/api/custom-bugs", {
      method: "GET",
      signal: expect.any(AbortSignal),
    });
  });

  // Update other tests to use proper typing
  it("should load and filter open bugs when showCompleted is false", async () => {
    const { result } = renderHook(() => useSortBugsList("/api/bugs", false));
    const hook = result.current as unknown as AsyncListData;

    const response = await hook.load({});

    expect(response.items).toEqual(
      mockBugs.filter((bug) => bug.status !== BugStatus.CLOSED),
    );
  });

  it("should load and filter closed bugs when showCompleted is true", async () => {
    const { result } = renderHook(() => useSortBugsList("/api/bugs", true));
    const hook = result.current as unknown as AsyncListData;
    const response = await hook.load({});

    expect(response.items).toEqual(
      mockBugs.filter((bug) => bug.status === BugStatus.CLOSED),
    );
  });

  it("should sort items in ascending order", async () => {
    const { result } = renderHook(() => useSortBugsList("/api/bugs", false));
    const hook = result.current as unknown as AsyncListData;

    const sortResult = await hook.sort({
      items: mockBugs,
      sortDescriptor: { column: "title", direction: "ascending" },
    });

    expect(sortResult.items[0].title).toBe("Bug A");
    expect(sortResult.items[1].title).toBe("Bug B");
  });

  it("should sort items in descending order", async () => {
    const { result } = renderHook(() => useSortBugsList("/api/bugs", false));
    const hook = result.current as unknown as AsyncListData;
    const sortResult = await hook.sort({
      items: mockBugs,
      sortDescriptor: { column: "title", direction: "descending" },
    });

    expect(sortResult.items[0].title).toBe("Bug B");
    expect(sortResult.items[1].title).toBe("Bug A");
  });

  it("should handle sorting with null values", async () => {
    const bugsWithNull = [
      ...mockBugs,
      {
        ...mockBugs[0],
        id: "3",
        title: null as any,
      },
    ];

    const { result } = renderHook(() => useSortBugsList("/api/bugs", false));
    const hook = result.current as unknown as AsyncListData;

    const sortResult = await hook.sort({
      items: bugsWithNull,
      sortDescriptor: { column: "title", direction: "ascending" },
    });

    expect(sortResult.items.length).toBe(3);
  });

  it("should handle missing sort descriptor", async () => {
    const { result } = renderHook(() => useSortBugsList("/api/bugs", false));
    const hook = result.current as unknown as AsyncListData;

    const sortResult = await hook.sort({
      items: mockBugs,
      sortDescriptor: null,
    });

    expect(sortResult.items).toEqual(mockBugs);
  });

  it("should handle API errors gracefully", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("API Error")));

    const { result } = renderHook(() => useSortBugsList("/api/bugs", false));
    const hook = result.current as unknown as AsyncListData;

    await expect((hook as any).load({})).rejects.toThrow("API Error");
  });
});
