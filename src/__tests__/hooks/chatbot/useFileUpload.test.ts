import { renderHook, act } from "@testing-library/react";
import React from "react";

import { useFileUpload } from "@/hooks/chatbot/useFileUpload";
import { generateSasToken } from "@/actions/chatbot/azure/action";
import { azureDirectUploadWithSas } from "@/src/lib/azureDirectUpload";
import { uploadSourceToChromaStore } from "@/actions/chatbot/chroma/action";

// Mock the dependencies
jest.mock("@/actions/chatbot/azure/action", () => ({
  generateSasToken: jest.fn(),
}));

jest.mock("@/src/lib/azureDirectUpload", () => ({
  azureDirectUploadWithSas: jest.fn(),
}));

jest.mock("@/actions/chatbot/chroma/action", () => ({
  uploadSourceToChromaStore: jest.fn(),
}));

// Mock useRef to return a consistent object that can be updated
const mockInputRef = { current: { value: "" } };

jest.spyOn(React, "useRef").mockReturnValue(mockInputRef);

// Mock console.error to prevent actual errors from showing in test output
const originalConsoleError = console.error;

beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("useFileUpload", () => {
  // Mock file for testing
  const mockPdfFile = new File(["dummy content"], "document.pdf", {
    type: "application/pdf",
  });
  const mockJsonFile = new File(['{"data": "test"}'], "setics.json", {
    type: "application/json",
  });

  // Mock success responses
  const mockSasResponse = {
    success: true,
    sasToken: "mockSasToken",
    containerName: "mockContainer",
    blobName: "mockBlobName",
    accountName: "mockAccount",
  };

  const mockUploadResult = {
    status: "success",
    filename: "document.pdf",
    store_metadata: {
      nb_collections: 1,
      details: { default: { count: 10 } },
    },
    added_count: 10,
    skipped_count: 0,
    skipped_sources: [],
    doc_sample_meta: { title: "Test Document" },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset mock input ref value
    if (mockInputRef.current) {
      mockInputRef.current.value = "";
    }

    // Default successful mocks
    (generateSasToken as jest.Mock).mockResolvedValue(mockSasResponse);
    (azureDirectUploadWithSas as jest.Mock).mockImplementation(
      (file, sasResponse, onProgress) => {
        // Simulate progress callback
        if (onProgress) onProgress(50);

        return Promise.resolve("mockBlobName");
      },
    );
    (uploadSourceToChromaStore as jest.Mock).mockResolvedValue(
      mockUploadResult,
    );
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useFileUpload("pdf"));

    expect(result.current.fileToUpload).toBeNull();
    expect(result.current.uploading).toBe(false);
    expect(result.current.uploadError).toBeNull();
    expect(result.current.uploadOperation).toBe("add");
    expect(result.current.uploadProgress).toBe(0);
    expect(result.current.uploadResult).toBeNull();
    expect(result.current.inputRef).toBe(mockInputRef);
  });

  it("should handle file selection", async () => {
    const { result } = renderHook(() => useFileUpload("pdf"));

    // Create mock event
    const mockChangeEvent = {
      target: {
        files: [mockPdfFile],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    // Use await act for state updates
    await act(async () => {
      result.current.handleFileChange(mockChangeEvent);
    });

    expect(result.current.fileToUpload).toBe(mockPdfFile);
    expect(result.current.uploadError).toBeNull();
    expect(result.current.uploadResult).toBeNull();
  });

  it("should handle PDF file upload success", async () => {
    const { result } = renderHook(() => useFileUpload("pdf"));

    // First select a file
    await act(async () => {
      const mockChangeEvent = {
        target: {
          files: [mockPdfFile],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      result.current.handleFileChange(mockChangeEvent);
    });

    // Then upload it with await to ensure all state updates complete
    await act(async () => {
      await result.current.handleFileUpload("add");
    });

    // Verify the correct API calls were made
    expect(generateSasToken).toHaveBeenCalledWith("document.pdf");
    expect(azureDirectUploadWithSas).toHaveBeenCalledWith(
      mockPdfFile,
      mockSasResponse,
      expect.any(Function),
    );
    expect(uploadSourceToChromaStore).toHaveBeenCalledWith("add", "pdf", {
      blob_name: "mockBlobName",
    });

    // Verify state updates
    expect(result.current.uploading).toBe(false);
    expect(result.current.uploadResult).toBe(mockUploadResult);
    expect(result.current.fileToUpload).toBeNull();
    expect(result.current.uploadProgress).toBe(0);
  });

  it("should handle Setics JSON file upload success", async () => {
    const { result } = renderHook(() => useFileUpload("setics"));

    // First select a file
    await act(async () => {
      const mockChangeEvent = {
        target: {
          files: [mockJsonFile],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      result.current.handleFileChange(mockChangeEvent);
    });

    // Then upload it with "update" operation - use await to ensure state updates complete
    await act(async () => {
      await result.current.handleFileUpload("update");
    });

    // Verify the correct API calls were made
    expect(generateSasToken).toHaveBeenCalledWith("setics.json");
    expect(azureDirectUploadWithSas).toHaveBeenCalledWith(
      mockJsonFile,
      mockSasResponse,
      expect.any(Function),
    );
    expect(uploadSourceToChromaStore).toHaveBeenCalledWith("update", "setics", {
      blob_name: "mockBlobName",
    });

    // Verify state updates
    expect(result.current.uploadOperation).toBe("update");
    expect(result.current.uploading).toBe(false);
    expect(result.current.uploadResult).toBe(mockUploadResult);
  });

  it("should handle upload progress updates", async () => {
    const { result } = renderHook(() => useFileUpload("pdf"));

    // First select a file
    await act(async () => {
      const mockChangeEvent = {
        target: {
          files: [mockPdfFile],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      result.current.handleFileChange(mockChangeEvent);
    });

    // For this test we need complete control over the progress callback and resolution timing
    // Create a manual Promise + resolve function
    let resolveUpload: (value: string) => void;
    const uploadPromise = new Promise<string>((resolve) => {
      resolveUpload = resolve;
    });

    // Mock implementation to capture the progress callback but manually control resolution
    let progressCallback: ((progress: number) => void) | undefined;

    (azureDirectUploadWithSas as jest.Mock).mockImplementation(
      (file, sasResponse, onProgress) => {
        progressCallback = onProgress;

        return uploadPromise;
      },
    );

    // Start the upload process but don't await it yet
    const uploadProcess = result.current.handleFileUpload("add");

    // Manually trigger progress updates and wrap each in act
    await act(async () => {
      // Wait a small delay to ensure the handleFileUpload has started
      await new Promise((r) => setTimeout(r, 10));
      if (progressCallback) progressCallback(25);
    });

    expect(result.current.uploadProgress).toBe(25);

    await act(async () => {
      if (progressCallback) progressCallback(75);
    });

    expect(result.current.uploadProgress).toBe(75);

    // Now resolve the upload and wait for it to complete
    await act(async () => {
      resolveUpload("mockBlobName");
      await uploadProcess;
    });

    // Progress should be reset after completion
    expect(result.current.uploadProgress).toBe(0);
  });

  it("should handle error when no file is selected", async () => {
    const { result } = renderHook(() => useFileUpload("pdf"));

    // Try to upload without selecting a file - use await to ensure completion
    await act(async () => {
      await result.current.handleFileUpload("add");
    });

    expect(result.current.uploadError).toBe("Please select a PDF file first");
    expect(result.current.uploading).toBe(false);
    expect(generateSasToken).not.toHaveBeenCalled();
  });

  it("should handle SAS token generation failure", async () => {
    const { result } = renderHook(() => useFileUpload("pdf"));

    // Mock SAS token generation failure
    const errorMessage = "Failed to generate SAS token";

    (generateSasToken as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // First select a file
    await act(async () => {
      const mockChangeEvent = {
        target: {
          files: [mockPdfFile],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      result.current.handleFileChange(mockChangeEvent);
    });

    // Try to upload - ensure we wait for error handling to complete
    await act(async () => {
      await result.current.handleFileUpload("add");
    });

    expect(result.current.uploadError).toBe(
      `Failed to add PDF document: ${errorMessage}`,
    );
    expect(result.current.uploading).toBe(false);
    expect(azureDirectUploadWithSas).not.toHaveBeenCalled();
  });

  it("should handle Azure upload failure", async () => {
    const { result } = renderHook(() => useFileUpload("pdf"));

    // Mock Azure upload failure
    const errorMessage = "Network error during upload";

    (azureDirectUploadWithSas as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    // First select a file
    await act(async () => {
      const mockChangeEvent = {
        target: {
          files: [mockPdfFile],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      result.current.handleFileChange(mockChangeEvent);
    });

    // Try to upload - wait for error handling
    await act(async () => {
      await result.current.handleFileUpload("add");
    });

    expect(result.current.uploadError).toBe(
      `Failed to add PDF document: ${errorMessage}`,
    );
    expect(result.current.uploading).toBe(false);
    expect(uploadSourceToChromaStore).not.toHaveBeenCalled();
  });

  it("should handle Chroma store processing failure", async () => {
    const { result } = renderHook(() => useFileUpload("pdf"));

    // Mock Chroma processing failure
    const errorMessage = "Failed to process document";

    (uploadSourceToChromaStore as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    // First select a file
    await act(async () => {
      const mockChangeEvent = {
        target: {
          files: [mockPdfFile],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      result.current.handleFileChange(mockChangeEvent);
    });

    // Try to upload - wait for error handling
    await act(async () => {
      await result.current.handleFileUpload("add");
    });

    expect(result.current.uploadError).toBe(
      `Failed to add PDF document: ${errorMessage}`,
    );
    expect(result.current.uploading).toBe(false);
  });

  it("should reset file input after successful upload", async () => {
    const { result } = renderHook(() => useFileUpload("pdf"));

    // Ensure mockInputRef has a value
    mockInputRef.current.value = "test";

    // First select a file
    await act(async () => {
      const mockChangeEvent = {
        target: {
          files: [mockPdfFile],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      result.current.handleFileChange(mockChangeEvent);
    });

    // Then upload it - wait for completion
    await act(async () => {
      await result.current.handleFileUpload("add");
    });

    // Verify input value was reset
    expect(mockInputRef.current.value).toBe("");
  });
});
