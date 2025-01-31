import { renderHook } from "@testing-library/react";

import { useImageUpload } from "@/hooks/useImageUpload";

describe("useImageUpload", () => {
  const mockFile = new File(["test"], "test.png", { type: "image/png" });
  const mockLabel = "Test Image";
  const mockSubdir = "test-dir";
  const mockResponse = {
    success: true,
    url: "https://example.com/test.png",
    azureId: "test-azure-id",
  };

  beforeEach(() => {
    // Mock the global fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      }),
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should upload image to Azure successfully", async () => {
    const { result } = renderHook(() => useImageUpload());

    const response = await result.current.uploadImageToAzure(
      mockFile,
      mockLabel,
      mockSubdir,
    );

    // Verify the response
    expect(response).toEqual(mockResponse);

    // Verify fetch was called correctly
    expect(fetch).toHaveBeenCalledWith(
      "/api/azure-report-images/upload",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      }),
    );

    // Verify FormData contents
    const fetchCall = (fetch as jest.Mock).mock.calls[0];
    const formData = fetchCall[1].body as FormData;

    expect(formData.get("file")).toEqual(mockFile);
    expect(formData.get("label")).toEqual(mockLabel);
    expect(formData.get("subdir")).toEqual(mockSubdir);
  });

  it("should handle upload failure", async () => {
    const errorResponse = { success: false, error: "Upload failed" };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(errorResponse),
      }),
    ) as jest.Mock;

    const { result } = renderHook(() => useImageUpload());

    const response = await result.current.uploadImageToAzure(
      mockFile,
      mockLabel,
      mockSubdir,
    );

    expect(response).toEqual(errorResponse);
  });

  it("should handle network errors", async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Network error")),
    ) as jest.Mock;

    const { result } = renderHook(() => useImageUpload());

    await expect(
      result.current.uploadImageToAzure(mockFile, mockLabel, mockSubdir),
    ).rejects.toThrow("Network error");
  });

  it("should create correct FormData object", async () => {
    const { result } = renderHook(() => useImageUpload());

    await result.current.uploadImageToAzure(mockFile, mockLabel, mockSubdir);

    const fetchCall = (fetch as jest.Mock).mock.calls[0];
    const formData = fetchCall[1].body as FormData;

    // Verify all required fields are present in FormData
    expect(formData.has("file")).toBeTruthy();
    expect(formData.has("label")).toBeTruthy();
    expect(formData.has("subdir")).toBeTruthy();
  });

  it("should handle empty or invalid input", async () => {
    const { result } = renderHook(() => useImageUpload());

    const emptyFile = new File([], "");

    await result.current.uploadImageToAzure(emptyFile, "", "");

    // Verify the request was still made with empty values
    expect(fetch).toHaveBeenCalledWith(
      "/api/azure-report-images/upload",
      expect.anything(),
    );
  });
});
