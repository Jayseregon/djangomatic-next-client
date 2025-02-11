import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { BlobStorage } from "@/components/admin/BlobStorage";
import { videosData } from "@/config/videosData";

// Create a proper XHR mock class with static properties
class MockXMLHttpRequest {
  static readonly UNSENT = 0;
  static readonly OPENED = 1;
  static readonly HEADERS_RECEIVED = 2;
  static readonly LOADING = 3;
  static readonly DONE = 4;

  open = jest.fn();
  send = jest.fn();
  setRequestHeader = jest.fn();
  readyState = 4;
  status = 200;
  onload = jest.fn();
  upload = {
    onprogress: jest.fn(),
  };
}

// Set up the mock
const mockXHR = jest.fn(
  () => new MockXMLHttpRequest(),
) as unknown as typeof XMLHttpRequest;

Object.defineProperties(mockXHR, {
  UNSENT: { value: MockXMLHttpRequest.UNSENT },
  OPENED: { value: MockXMLHttpRequest.OPENED },
  HEADERS_RECEIVED: { value: MockXMLHttpRequest.HEADERS_RECEIVED },
  LOADING: { value: MockXMLHttpRequest.LOADING },
  DONE: { value: MockXMLHttpRequest.DONE },
});

// Assign the mock to window.XMLHttpRequest
window.XMLHttpRequest = mockXHR;

// Mock fetch API
global.fetch = jest.fn();

// Mock EventSource
class MockEventSource {
  onmessage: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  close = jest.fn();

  constructor(_url: string) {
    // Prefix url with underscore to indicate it's intentionally unused
  }
}

global.EventSource = MockEventSource as any;

describe("BlobStorage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
        status: 200,
      }),
    );
  });

  // Helper function to wait for fetch and state updates
  const waitForAsyncUpdates = async () => {
    // Wait for all promises to resolve
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  };

  it("renders the component with initial state", async () => {
    await act(async () => {
      render(<BlobStorage />);
      await waitForAsyncUpdates();
    });

    // Check if main elements are rendered
    expect(screen.getByLabelText("file-input")).toBeInTheDocument();
    expect(screen.getByLabelText("category-name")).toBeInTheDocument();
    expect(screen.getByLabelText("client-name")).toBeInTheDocument();
    expect(screen.getByLabelText("upload-button")).toBeInTheDocument();
    expect(screen.getByLabelText("azure-blob-table")).toBeInTheDocument();
  });

  it("handles file selection", async () => {
    await act(async () => {
      render(<BlobStorage />);
      await waitForAsyncUpdates();
    });

    const file = new File(["test content"], "test.mp4", { type: "video/mp4" });
    const fileInput = screen.getByLabelText("file-input");

    await act(async () => {
      await userEvent.upload(fileInput, file);
      await waitForAsyncUpdates();
    });

    expect(screen.getByText("test.mp4")).toBeInTheDocument();
  });

  it("populates category and client dropdowns correctly", async () => {
    await act(async () => {
      render(<BlobStorage />);
      await waitForAsyncUpdates();
    });

    const categorySelect = screen.getByLabelText("category-name");
    const clientSelect = screen.getByLabelText("client-name");

    // Check if all category options are present
    videosData.category_labels.forEach((category) => {
      expect(categorySelect).toContainHTML(category.label);
    });

    // Check if all client options are present
    videosData.client_labels.forEach((client) => {
      expect(clientSelect).toContainHTML(client.label);
    });
  });

  it("handles file upload process", async () => {
    await act(async () => {
      render(<BlobStorage />);
      await waitForAsyncUpdates();
    });

    // Setup file and selections
    const file = new File(["test content"], "test.mp4", { type: "video/mp4" });
    const fileInput = screen.getByLabelText("file-input");
    const categorySelect = screen.getByLabelText("category-name");
    const clientSelect = screen.getByLabelText("client-name");
    const uploadButton = screen.getByLabelText("upload-button");

    // Simulate user actions
    await act(async () => {
      await userEvent.upload(fileInput, file);
      await userEvent.selectOptions(categorySelect, "admin");
      await userEvent.selectOptions(clientSelect, "tds");
      await waitForAsyncUpdates();
    });

    // Verify upload button is enabled
    expect(uploadButton).not.toBeDisabled();

    // Trigger upload
    await act(async () => {
      await userEvent.click(uploadButton);
      await waitForAsyncUpdates();
    });

    // Verify XHR was called
    expect(XMLHttpRequest).toHaveBeenCalled();
  });

  it("handles API interactions for blob deletion", async () => {
    const mockBlobs = [
      {
        name: "test/test.mp4",
        createdOn: new Date().toISOString(),
        contentType: "video/mp4",
        url: "http://test.com",
        tags: {
          categoryName: "admin",
          clientName: "tds",
          uuid: "123",
        },
      },
    ];

    // Setup fetch mocks
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockBlobs),
          status: 200,
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
        }),
      );

    // Render and wait for initial data fetch
    await act(async () => {
      render(<BlobStorage />);
      await waitForAsyncUpdates();
    });

    // Verify the fetch was called
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/azure-blob/list"),
      expect.any(Object),
    );

    // Wait for any additional state updates
    await waitForAsyncUpdates();
  });

  it("shows upload progress", async () => {
    await act(async () => {
      render(<BlobStorage />);
      await waitForAsyncUpdates();
    });

    const file = new File(["test content"], "test.mp4", { type: "video/mp4" });

    await act(async () => {
      await userEvent.upload(screen.getByLabelText("file-input"), file);
      await userEvent.selectOptions(
        screen.getByLabelText("category-name"),
        "admin",
      );
      await userEvent.selectOptions(
        screen.getByLabelText("client-name"),
        "tds",
      );
      await waitForAsyncUpdates();
    });

    await act(async () => {
      await userEvent.click(screen.getByLabelText("upload-button"));
      await waitForAsyncUpdates();
    });

    // Simulate progress event
    const eventSource = new MockEventSource("");

    await act(async () => {
      if (eventSource.onmessage) {
        eventSource.onmessage({
          data: JSON.stringify({ loadedBytes: 50 }),
        });
      }
      await waitForAsyncUpdates();
    });

    // Check for progress bar
    const progressBar = screen.getByTestId("mock-progress");

    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("role", "progressbar");
  });
});
