import { getKeywordsEmbeddings } from "@/src/actions/chatbot/action";

describe("getKeywordsEmbeddings", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it("should successfully fetch embeddings for keywords", async () => {
    const mockResponse = {
      embeddings: [[0.1, 0.2, 0.3]],
      keywords: ["test"],
    };

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await getKeywordsEmbeddings(["test"]);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://rag-ai-toolbox.azurewebsites.net/embeddings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: ["test"],
        }),
      },
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle API error responses", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      }),
    );

    await expect(getKeywordsEmbeddings(["test"])).rejects.toThrow(
      "Error fetching keywords embeddings. Please try again later.",
    );
  });

  it("should handle network errors", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Network error")),
    );

    await expect(getKeywordsEmbeddings(["test"])).rejects.toThrow(
      "Error fetching keywords embeddings. Please try again later.",
    );
  });

  it("should handle multiple keywords", async () => {
    const mockResponse = {
      embeddings: [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
      ],
      keywords: ["test1", "test2"],
    };

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await getKeywordsEmbeddings(["test1", "test2"]);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://rag-ai-toolbox.azurewebsites.net/embeddings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: ["test1", "test2"],
        }),
      },
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle empty keywords array", async () => {
    const mockResponse = {
      embeddings: [],
      keywords: [],
    };

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await getKeywordsEmbeddings([]);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://rag-ai-toolbox.azurewebsites.net/embeddings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: [],
        }),
      },
    );
    expect(result).toEqual(mockResponse);
  });
});
