jest.mock("@/actions/django/action");
jest.mock("@/actions/generic/action");
jest.mock("@/actions/prisma/tracking/action", () => ({
  createAppTrackingEntry: jest.fn().mockResolvedValue("test-entry-id"),
  updateAppTrackingEntry: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("isomorphic-dompurify", () => ({
  sanitize: jest.fn((text) => text),
}));

// Define post inside jest.mock; export it via _post.
jest.mock("axios", () => {
  const post = jest.fn();

  return {
    create: jest.fn(() => ({ post })),
    _post: post,
  };
});

import axios from "axios";

import {
  fetchDbSchemas,
  fetchSchemaTables,
  startTask,
  checkTaskStatus,
  schemasCache,
  tablesCache,
} from "@/lib/dbRequests";
import { getServerTokens } from "@/actions/django/action";
import { getServerCsrfToken } from "@/actions/generic/action";
const { _post: mockPost } = axios as unknown as { _post: jest.Mock };

describe("Database Request Utils", () => {
  const mockToken = "mock-token";
  const mockCsrf = "mock-csrf";
  let originalSetTimeout: typeof global.setTimeout;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeAll(() => {
    originalSetTimeout = global.setTimeout;
    // Mock setTimeout
    (global.setTimeout as unknown as jest.Mock) = jest.fn((_cb) => {
      return null as unknown as NodeJS.Timeout;
    });
    // Silence console.error and console.log during tests
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore original setTimeout and console methods
    global.setTimeout = originalSetTimeout;
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockPost.mockReset();
    (global.setTimeout as unknown as jest.Mock).mockClear();

    // Clear caches
    schemasCache.clear();
    tablesCache.clear();

    // Setup default mocks
    (getServerTokens as jest.Mock).mockResolvedValue({
      djAuthToken: mockToken,
    });
    (getServerCsrfToken as jest.Mock).mockResolvedValue(mockCsrf);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("fetchDbSchemas", () => {
    const mockSchemas = [
      { value: "schema1", label: "Schema 1" },
      { value: "schema2", label: "Schema 2" },
    ];

    it("should fetch schemas successfully", async () => {
      const mockResponse = {
        status: 200,
        data: {
          error: "no error",
          schema_dropdown_data: mockSchemas,
        },
      };

      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await fetchDbSchemas({
        target_db: "test_db",
        backendUser: "test_user",
      });

      expect(result).toEqual(mockSchemas);
      expect(mockPost).toHaveBeenCalledWith(
        "/saas/tds/ajax/query-schema-list/",
        { target_db: "test_db" },
        expect.any(Object),
      );
    });

    it("should handle errors gracefully", async () => {
      mockPost.mockRejectedValueOnce(new Error("Network error"));

      const result = await fetchDbSchemas({
        target_db: "test_db",
        backendUser: "test_user",
      });

      expect(result).toEqual([{ value: "no_data", label: "No Data Found" }]);
    });
  });

  describe("fetchSchemaTables", () => {
    const mockTables = [
      { value: "table1", label: "Table 1" },
      { value: "table2", label: "Table 2" },
    ];

    it("should fetch tables successfully", async () => {
      const mockResponse = {
        status: 200,
        data: {
          error: "no error",
          table_dropdown_data: mockTables,
        },
      };

      mockPost.mockResolvedValueOnce(mockResponse);

      const result = await fetchSchemaTables({
        target_db: "test_db",
        schema_choice: "test_schema",
        user_pattern: "test_pattern",
        backendUser: "test_user",
      });

      expect(result).toEqual(mockTables);
      expect(mockPost).toHaveBeenCalledWith(
        "/saas/tds/ajax/query-poles-tables-from-schema/",
        expect.any(Object),
        expect.any(Object),
      );
    });
  });

  describe("startTask", () => {
    it("should start a task successfully", async () => {
      const mockTaskId = "task-123";

      mockPost.mockResolvedValueOnce({
        status: 200,
        data: { task_id: mockTaskId },
      });

      const result = await startTask({
        db_choice: "test_db",
        schema_choice: "test_schema",
        dbClass: "test_class",
        endpoint: "/test/endpoint",
        backendUser: "test_user",
      });

      expect(result).toBe(mockTaskId);
    });

    it("should handle file uploads correctly", async () => {
      const mockFile = new File(["test"], "test.txt");
      const mockTaskId = "task-123";

      mockPost.mockResolvedValueOnce({
        status: 200,
        data: { task_id: mockTaskId },
      });

      await startTask({
        db_choice: "test_db",
        schema_choice: "test_schema",
        dbClass: "test_class",
        endpoint: "/test/endpoint",
        file: mockFile,
        backendUser: "test_user",
      });

      // Verify FormData was used
      expect(mockPost).toHaveBeenCalledWith(
        "/test/endpoint",
        expect.any(FormData),
        expect.any(Object),
      );
    });
  });

  describe("checkTaskStatus", () => {
    let mockSetTaskData: jest.Mock;

    beforeEach(() => {
      mockSetTaskData = jest.fn();
    });

    it("should handle task status checks correctly", async () => {
      const mockResponse = {
        status: 200,
        data: {
          status: "SUCCESS",
          result: {
            result: "<p>Task completed</p>",
            zip_url: "http://example.com/file.zip",
          },
        },
      };

      mockPost.mockResolvedValueOnce(mockResponse);

      await checkTaskStatus({
        task_id: "task-123",
        waitTime: 1000,
        setTaskData: mockSetTaskData,
        accessDownload: true,
        backendUser: "test_user",
        entryId: "entry-123",
      });

      expect(mockSetTaskData).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith(
        "/saas/tds/ajax/check-task-status/",
        { task_id: "task-123" },
        expect.any(Object),
      );
    });

    it("should handle pending tasks correctly", async () => {
      const mockResponse = {
        status: 200,
        data: {
          status: "PENDING",
          result: {},
        },
      };

      mockPost.mockResolvedValueOnce(mockResponse);

      await checkTaskStatus({
        task_id: "task-123",
        waitTime: 1000,
        setTaskData: mockSetTaskData,
        backendUser: "test_user",
        entryId: "entry-123",
      });

      expect(global.setTimeout).toHaveBeenCalledTimes(1);
      expect(global.setTimeout).toHaveBeenLastCalledWith(
        expect.any(Function),
        1000,
      );
    });
  });
});
