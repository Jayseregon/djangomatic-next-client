import { keywordsEmbedding } from "@/src/tools/keywordsEmbedding";
import { getKeywordsEmbeddings } from "@/src/actions/chatbot/action";

// Mock the server action
jest.mock("@/src/actions/chatbot/action");

describe("keywordsEmbedding tool", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully get embeddings for keywords", async () => {
    const mockResponse = {
      embeddings: [[0.1, 0.2, 0.3]],
      keywords: ["test"],
    };

    (getKeywordsEmbeddings as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await keywordsEmbedding.execute(
      { keywords: ["test"] },
      {
        toolCallId: "",
        messages: [],
      },
    );

    expect(getKeywordsEmbeddings).toHaveBeenCalledWith(["test"]);
    expect(result).toEqual(mockResponse);
  });

  it("should handle empty keywords array", async () => {
    const mockResponse = {
      embeddings: [],
      keywords: [],
    };

    (getKeywordsEmbeddings as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await keywordsEmbedding.execute(
      { keywords: [] },
      {
        toolCallId: "",
        messages: [],
      },
    );

    expect(getKeywordsEmbeddings).toHaveBeenCalledWith([]);
    expect(result).toEqual(mockResponse);
  });

  it("should handle API errors gracefully", async () => {
    (getKeywordsEmbeddings as jest.Mock).mockRejectedValueOnce(
      new Error("API Error"),
    );

    const result = await keywordsEmbedding.execute(
      { keywords: ["test"] },
      {
        toolCallId: "",
        messages: [],
      },
    );

    expect(getKeywordsEmbeddings).toHaveBeenCalledWith(["test"]);
    expect(result).toEqual({
      error: "Failed to get keywords embeddings. Please try again later.",
    });
  });

  it("should handle multiple keywords", async () => {
    const mockResponse = {
      embeddings: [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
      ],
      keywords: ["test1", "test2"],
    };

    (getKeywordsEmbeddings as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await keywordsEmbedding.execute(
      { keywords: ["test1", "test2"] },
      {
        toolCallId: "",
        messages: [],
      },
    );

    expect(getKeywordsEmbeddings).toHaveBeenCalledWith(["test1", "test2"]);
    expect(result).toEqual(mockResponse);
  });
});
