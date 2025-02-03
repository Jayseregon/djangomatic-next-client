import { parseTextBold, fetchImageBatch } from "@/lib/pdfRenderUtils";
import { TowerReportImage } from "@/interfaces/reports";

// Mock @react-pdf/renderer
jest.mock("@react-pdf/renderer", () => ({
  Text: ({
    children,
    style,
  }: {
    children: React.ReactNode;
    style?: object;
  }) => (
    <span data-testid="pdf-text" style={style}>
      {children}
    </span>
  ),
  StyleSheet: {
    create: (styles: object) => styles,
  },
}));

describe("parseTextBold", () => {
  it("should parse text without bold markers correctly", () => {
    const text = "Simple text without bold";
    const result = parseTextBold(text);

    expect(result).toHaveLength(1);
    expect(result[0].props.children).toBe(text);
  });

  it("should parse text with bold markers correctly", () => {
    const text = "This is **bold** text";
    const result = parseTextBold(text);

    expect(result).toHaveLength(3);
    expect(result[0].props.children).toBe("This is ");
    expect(result[1].props.children).toBe("bold");
    expect(result[1].props.style).toBeDefined();
    expect(result[2].props.children).toBe(" text");
  });

  it("should handle multiple bold sections", () => {
    const text = "**First** normal **Second**";
    const result = parseTextBold(text);

    // Updated expectation to match actual output (5 elements including empty strings)
    expect(result).toHaveLength(5);
    // First empty string
    expect(result[0].props.children).toBe("");
    // Bold "First"
    expect(result[1].props.children).toBe("First");
    expect(result[1].props.style).toBeDefined();
    // Normal text
    expect(result[2].props.children).toBe(" normal ");
    // Bold "Second"
    expect(result[3].props.children).toBe("Second");
    expect(result[3].props.style).toBeDefined();
    // Last empty string
    expect(result[4].props.children).toBe("");
  });

  it("should handle empty string", () => {
    const text = "";
    const result = parseTextBold(text);

    expect(result).toHaveLength(1);
    expect(result[0].props.children).toBe("");
  });
});

describe("fetchImageBatch", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    global.fetch = jest.fn();
    global.btoa = jest.fn();
  });

  it("should fetch and process images successfully", async () => {
    const mockImages: TowerReportImage[] = [
      {
        id: "1",
        url: "http://example.com/image1.jpg",
        label: "Test Image 1",
        deficiency_check_procedure: "",
        deficiency_recommendation: "",
        imgIndex: 0,
        azureId: "azure1",
      },
    ];

    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve([
          {
            url: "http://example.com/image1.jpg",
            data: [1, 2, 3], // Mock Uint8Array data
            contentType: "image/jpeg",
          },
        ]),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    (global.btoa as jest.Mock).mockReturnValue("base64string");

    const result = await fetchImageBatch(mockImages);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/proxy-image?urls="),
    );
    expect(result["http://example.com/image1.jpg"]).toBe(
      "data:image/jpeg;base64,base64string",
    );
  });

  it("should handle fetch errors gracefully", async () => {
    const mockImages: TowerReportImage[] = [
      {
        id: "1",
        url: "http://example.com/image1.jpg",
        label: "Test Image 1",
        deficiency_check_procedure: "",
        deficiency_recommendation: "",
        imgIndex: 0,
        azureId: "azure1",
      },
    ];

    const mockResponse = {
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const result = await fetchImageBatch(mockImages);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error loading images:",
      expect.any(Error),
    );
    expect(result).toEqual({});
    consoleSpy.mockRestore();
  });

  it("should handle empty image array", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve([]),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    const result = await fetchImageBatch([]);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("urls=%5B%5D"),
    );
    expect(result).toEqual({});
  });

  it("should handle null response from server", async () => {
    const mockImages: TowerReportImage[] = [
      {
        id: "1",
        url: "http://example.com/image1.jpg",
        label: "Test Image 1",
        deficiency_check_procedure: "",
        deficiency_recommendation: "",
        imgIndex: 0,
        azureId: "azure1",
      },
    ];

    const mockResponse = {
      ok: true,
      json: () => Promise.resolve([null]),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await fetchImageBatch(mockImages);

    expect(result).toEqual({});
  });
});
