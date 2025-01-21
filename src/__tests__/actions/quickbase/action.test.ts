import { getQuickbaseReportData } from "@/actions/quickbase/action";
import { QBHelper } from "@/lib/quickbase";

// Mock the environment variables
const originalEnv = process.env;

jest.mock("@/lib/quickbase", () => ({
  QueryBuilderQB: {
    encodeWhereQueries: jest.fn((_queries) => "{mockWhereQuery}"),
    buildQuery: jest.fn((tableId, whereQuery, select) => ({
      from: tableId,
      where: whereQuery,
      ...(select && { select }),
    })),
  },
  QBHelper: {
    makeRequest: jest.fn(),
    dataCleanup: jest.fn(),
  },
}));

describe("getQuickbaseReportData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, QB_API_TOKEN: "mock-token" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should throw error if no ID is provided", async () => {
    await expect(getQuickbaseReportData(undefined)).rejects.toThrow(
      "No ID provided for QuickBase report data retrieval.",
    );
  });

  it("should throw error if no API token is available", async () => {
    delete process.env.QB_API_TOKEN;
    await expect(getQuickbaseReportData("123")).rejects.toThrow(
      "Quickbase API token is required.",
    );
  });

  it("should successfully retrieve and format report data", async () => {
    const mockReportData = { data: [] };
    const mockTask6Data = {
      data: [
        {
          "1048": { value: [{ name: "John Smith" }] },
        },
      ],
    };
    const mockTask8Data = { data: [] };

    (QBHelper.makeRequest as jest.Mock)
      .mockImplementationOnce(() => ({
        data: () => Promise.resolve(mockReportData),
      }))
      .mockImplementationOnce(() => ({
        data: () => Promise.resolve(mockTask6Data),
      }))
      .mockImplementationOnce(() => ({
        data: () => Promise.resolve(mockTask8Data),
      }));

    (QBHelper.dataCleanup as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({}))
      .mockImplementationOnce(() =>
        Promise.resolve({ "1048": [{ name: "John Smith" }] }),
      )
      .mockImplementationOnce(() => Promise.resolve({}));

    const result = await getQuickbaseReportData("123");

    expect(result["1048"]).toBe("John Smith, P. Eng.");
  });

  it("should handle Eli Mohammadi name formatting correctly", async () => {
    const mockReportData = { data: [] };
    const mockTask6Data = { data: [] };
    const mockTask8Data = {
      data: [
        {
          "1048": { value: [{ name: "Elahe Mohammadi" }] },
        },
      ],
    };

    (QBHelper.makeRequest as jest.Mock)
      .mockImplementationOnce(() => ({
        data: () => Promise.resolve(mockReportData),
      }))
      .mockImplementationOnce(() => ({
        data: () => Promise.resolve(mockTask6Data),
      }))
      .mockImplementationOnce(() => ({
        data: () => Promise.resolve(mockTask8Data),
      }));

    (QBHelper.dataCleanup as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({}))
      .mockImplementationOnce(() => Promise.resolve({}))
      .mockImplementationOnce(() =>
        Promise.resolve({ "1048": [{ name: "Elahe Mohammadi" }] }),
      );

    const result = await getQuickbaseReportData("123");

    expect(result["1048"]).toBe("Eli Mohammadi, P. Eng.");
  });

  it("should set engineer as N/A when no task data is found", async () => {
    (QBHelper.makeRequest as jest.Mock).mockImplementation(() =>
      Promise.resolve({ data: {} }),
    );

    (QBHelper.dataCleanup as jest.Mock).mockReturnValue({});

    const result = await getQuickbaseReportData("123");

    expect(result["1048"]).toBe("N/A");
  });

  it("should handle API errors gracefully", async () => {
    (QBHelper.makeRequest as jest.Mock).mockRejectedValue(
      new Error("API Error"),
    );

    await expect(getQuickbaseReportData("123")).rejects.toThrow(
      "Error fetching report data from QuickBase: API Error",
    );
  });

  it("should prioritize task 8 engineer over task 6", async () => {
    const mockReportData = { data: [] };
    const mockTask6Data = {
      data: [
        {
          "1048": { value: [{ name: "Engineer6" }] },
        },
      ],
    };
    const mockTask8Data = {
      data: [
        {
          "1048": { value: [{ name: "Engineer8" }] },
        },
      ],
    };

    (QBHelper.makeRequest as jest.Mock)
      .mockImplementationOnce(() => ({
        data: () => Promise.resolve(mockReportData),
      }))
      .mockImplementationOnce(() => ({
        data: () => Promise.resolve(mockTask6Data),
      }))
      .mockImplementationOnce(() => ({
        data: () => Promise.resolve(mockTask8Data),
      }));

    (QBHelper.dataCleanup as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({}))
      .mockImplementationOnce(() =>
        Promise.resolve({ "1048": [{ name: "Engineer6" }] }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({ "1048": [{ name: "Engineer8" }] }),
      );

    const result = await getQuickbaseReportData("123");

    expect(result["1048"]).toBe("Engineer8, P. Eng.");
  });
});
