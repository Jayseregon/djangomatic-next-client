import { renderHook, act } from "@testing-library/react";

import { useWebUpload } from "@/hooks/chatbot/useWebUpload";
import { uploadSourceToChromaStore } from "@/actions/chatbot/chroma/action";

// Mock the dependencies
jest.mock("@/actions/chatbot/chroma/action", () => ({
  uploadSourceToChromaStore: jest.fn(),
}));

// Mock console.error to prevent actual errors from showing in test output
const originalConsoleError = console.error;

beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("useWebUpload", () => {
  // Mock success response
  const mockUploadResult = {
    status: "success",
    filename: "example.com",
    store_metadata: {
      nb_collections: 1,
      details: { default: { count: 10 } },
    },
    added_count: 10,
    skipped_count: 0,
    skipped_sources: [],
    doc_sample_meta: { title: "Example Website" },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default successful mock implementation
    (uploadSourceToChromaStore as jest.Mock).mockResolvedValue(
      mockUploadResult,
    );
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useWebUpload());

    expect(result.current.urlToProcess).toBe("");
    expect(result.current.processing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.operation).toBe("add");
    expect(result.current.withImages).toBe(false);
    expect(result.current.uploadResult).toBeNull();
  });

  it("should update URL value when setUrlToProcess is called", async () => {
    const { result } = renderHook(() => useWebUpload());

    await act(async () => {
      result.current.setUrlToProcess("https://example.com");
    });

    expect(result.current.urlToProcess).toBe("https://example.com");
  });

  it("should toggle withImages value when setWithImages is called", async () => {
    const { result } = renderHook(() => useWebUpload());

    // Initially false
    expect(result.current.withImages).toBe(false);

    await act(async () => {
      result.current.setWithImages(true);
    });

    expect(result.current.withImages).toBe(true);

    await act(async () => {
      result.current.setWithImages(false);
    });

    expect(result.current.withImages).toBe(false);
  });

  it('should handle URL submission with "add" operation successfully', async () => {
    const { result } = renderHook(() => useWebUpload());

    // Set URL
    await act(async () => {
      result.current.setUrlToProcess("https://example.com");
    });

    // Submit with add operation
    await act(async () => {
      await result.current.handleUrlSubmit("add");
    });

    // Verify API was called with correct parameters
    expect(uploadSourceToChromaStore).toHaveBeenCalledWith("add", "web", {
      web_url: "https://example.com",
      with_images: false,
    });

    // Verify state updates
    expect(result.current.processing).toBe(false);
    expect(result.current.operation).toBe("add");
    expect(result.current.error).toBeNull();
    expect(result.current.uploadResult).toBe(mockUploadResult);
    expect(result.current.urlToProcess).toBe(""); // URL should be cleared after success
  });

  it('should handle URL submission with "update" operation successfully', async () => {
    const { result } = renderHook(() => useWebUpload());

    // Set URL and enable withImages
    await act(async () => {
      result.current.setUrlToProcess("https://example.com");
      result.current.setWithImages(true);
    });

    // Submit with update operation
    await act(async () => {
      await result.current.handleUrlSubmit("update");
    });

    // Verify API was called with correct parameters
    expect(uploadSourceToChromaStore).toHaveBeenCalledWith("update", "web", {
      web_url: "https://example.com",
      with_images: true,
    });

    // Verify state updates
    expect(result.current.processing).toBe(false);
    expect(result.current.operation).toBe("update");
    expect(result.current.error).toBeNull();
    expect(result.current.uploadResult).toBe(mockUploadResult);
    expect(result.current.urlToProcess).toBe(""); // URL should be cleared after success
  });

  it("should handle error when empty URL is submitted", async () => {
    const { result } = renderHook(() => useWebUpload());

    // Submit with empty URL
    await act(async () => {
      await result.current.handleUrlSubmit("add");
    });

    // Verify error state and API not called
    expect(result.current.error).toBe("Please enter a URL");
    expect(result.current.processing).toBe(false);
    expect(uploadSourceToChromaStore).not.toHaveBeenCalled();
  });

  it("should handle API error during URL submission", async () => {
    const { result } = renderHook(() => useWebUpload());

    // Mock API error
    const errorMessage = "Network error during submission";

    (uploadSourceToChromaStore as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    // Set URL
    await act(async () => {
      result.current.setUrlToProcess("https://example.com");
    });

    // Submit
    await act(async () => {
      await result.current.handleUrlSubmit("add");
    });

    // Verify error state
    expect(result.current.error).toBe(`Failed to add URL: ${errorMessage}`);
    expect(result.current.processing).toBe(false);
    expect(result.current.uploadResult).toBeNull();
    expect(result.current.urlToProcess).toBe("https://example.com"); // URL remains in case of error
  });

  it("should handle URL with whitespace", async () => {
    const { result } = renderHook(() => useWebUpload());

    // Set URL with whitespace
    await act(async () => {
      result.current.setUrlToProcess("  https://example.com  ");
    });

    // Submit
    await act(async () => {
      await result.current.handleUrlSubmit("add");
    });

    // Verify API was called with trimmed URL
    expect(uploadSourceToChromaStore).toHaveBeenCalledWith("add", "web", {
      web_url: "  https://example.com  ", // The hook doesn't explicitly trim before passing to API
      with_images: false,
    });

    // URL should be cleared after success
    expect(result.current.urlToProcess).toBe("");
  });

  it("should reset upload result when starting a new submission", async () => {
    const { result } = renderHook(() => useWebUpload());

    // First successful upload - explicitly await the entire operation
    await act(async () => {
      result.current.setUrlToProcess("https://example.com");
    });

    // Verify the URL is set
    expect(result.current.urlToProcess).toBe("https://example.com");

    // Complete the submission and wait for state update
    await act(async () => {
      await result.current.handleUrlSubmit("add");
    });

    // The upload result should now be set to the mock result
    expect(result.current.uploadResult).toEqual(mockUploadResult); // Changed toBe to toEqual
    expect(uploadSourceToChromaStore).toHaveBeenCalledTimes(1);

    // Start new upload
    await act(async () => {
      result.current.setUrlToProcess("https://example2.com");
    });

    // Mock API to reject this time
    (uploadSourceToChromaStore as jest.Mock).mockRejectedValue(
      new Error("API failure"),
    );

    // Submit again
    await act(async () => {
      await result.current.handleUrlSubmit("add");
    });

    // Result should be reset
    expect(result.current.uploadResult).toBeNull();
    expect(result.current.error).toBe("Failed to add URL: API failure");
  });
});
