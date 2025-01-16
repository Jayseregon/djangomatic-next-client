import axios from "axios";

import {
  GetRecordFromQueryQB,
  QueryOperatorQB,
  QueryBuilderQB,
  QBHelper,
} from "@/lib/quickbase";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("QuickBase API Integration", () => {
  const mockApiToken = "test_token";
  const mockTableId = "bqx7a9mep";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GetRecordFromQueryQB", () => {
    it("should make a successful API request", async () => {
      const mockQuery = { from: mockTableId, where: "{3.EX.1}" };
      const mockResponse = {
        status: 200,
        data: {
          data: [
            { field1: { value: "test1" } },
            { field2: { value: "test2" } },
          ],
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const qbRequest = new GetRecordFromQueryQB(mockApiToken, mockQuery);
      const result = await qbRequest.execute();

      expect(result.status).toBe(200);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api.quickbase.com/v1/records/query",
        mockQuery,
        expect.any(Object),
      );

      const data = await result.data();

      expect(data).toEqual(mockResponse.data);
    });

    it("should include correct headers in the request", async () => {
      const mockQuery = { from: mockTableId };

      mockedAxios.post.mockResolvedValueOnce({ status: 200, data: {} });

      const qbRequest = new GetRecordFromQueryQB(mockApiToken, mockQuery);

      await qbRequest.execute();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        {
          headers: {
            "QB-Realm-Hostname": "telecon.quickbase.com",
            "User-Agent": "Djangomatic_GetRecordFromQueryQB_v1.0-dev",
            Authorization: `QB-USER-TOKEN ${mockApiToken}`,
            "Content-Type": "application/json",
          },
        },
      );
    });
  });

  describe("QueryBuilderQB", () => {
    it("should correctly encode where queries", () => {
      const queries: [string, string, string, string?][] = [
        ["3", "IS_EQUAL_TO", "1"],
        ["4", "CONTAINS", "test", "AND"],
        ["5", "IS_GREATER_THAN", "10", "OR"],
      ];

      const result = QueryBuilderQB.encodeWhereQueries(queries);

      expect(result).toBe("{3.EX.1}AND{4.CT.test}OR{5.GT.10}");
    });

    it("should build a complete query with select fields", () => {
      const whereQuery = "{3.EX.1}";
      const selectFields = [3, 4, 5];

      const result = QueryBuilderQB.buildQuery(
        mockTableId,
        whereQuery,
        selectFields,
      );

      expect(result).toEqual({
        from: mockTableId,
        select: selectFields,
        where: whereQuery,
      });
    });

    it("should build a query without select fields", () => {
      const whereQuery = "{3.EX.1}";

      const result = QueryBuilderQB.buildQuery(mockTableId, whereQuery);

      expect(result).toEqual({
        from: mockTableId,
        where: whereQuery,
      });
    });
  });

  describe("QBHelper", () => {
    it("should successfully make a request and clean up data", async () => {
      const mockQuery = { from: mockTableId };
      const mockResponse = {
        status: 200,
        data: {
          data: [
            {
              field1: { value: "test1" },
              field2: { value: 123 },
            },
          ],
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await QBHelper.makeRequest(
        mockQuery,
        "test",
        mockApiToken,
      );
      const cleanedData = await QBHelper.dataCleanup(result);

      expect(cleanedData).toEqual({
        field1: "test1",
        field2: 123,
      });
    });

    it("should handle errors in makeRequest", async () => {
      const mockQuery = { from: mockTableId };

      mockedAxios.post.mockResolvedValueOnce({ status: 400 });

      const result = await QBHelper.makeRequest(
        mockQuery,
        "test",
        mockApiToken,
      );

      await expect(result.data()).rejects.toThrow(
        "Error fetching test data from QuickBase",
      );
    });

    it("should handle errors in dataCleanup", async () => {
      const invalidResponse = {
        data: () => Promise.resolve({ invalidData: true }),
      };

      await expect(QBHelper.dataCleanup(invalidResponse)).rejects.toThrow(
        "Data cleanup failed",
      );
    });
  });

  describe("QueryOperatorQB", () => {
    it("should have all required operators", () => {
      expect(QueryOperatorQB.CONTAINS).toBe("CT");
      expect(QueryOperatorQB.IS_EQUAL_TO).toBe("EX");
      expect(QueryOperatorQB.IS_GREATER_THAN).toBe("GT");
      expect(QueryOperatorQB.IS_LESS_THAN).toBe("LT");
      // Add more operator checks as needed
    });
  });
});
