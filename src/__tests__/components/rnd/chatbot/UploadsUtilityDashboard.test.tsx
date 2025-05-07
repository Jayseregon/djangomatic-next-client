import React from "react";
import { render, screen } from "@testing-library/react";

import { UploadsUtilityDashboard } from "@/components/rnd/chatbot/UploadsUtilityDashboard";
import * as FileUploadHook from "@/hooks/chatbot/useFileUpload";
import * as WebUploadHook from "@/hooks/chatbot/useWebUpload";
import {
  AddDocumentsResponse,
  UpdateDocumentsResponse,
} from "@/interfaces/chatbot";

// Mock the custom hooks
jest.mock("@/hooks/chatbot/useFileUpload", () => ({
  useFileUpload: jest.fn(),
}));

jest.mock("@/hooks/chatbot/useWebUpload", () => ({
  useWebUpload: jest.fn(),
}));

// Mock the child components
jest.mock("@/components/rnd/chatbot/UploadCard", () => ({
  UploadCard: jest.fn(({ title, children }) => (
    <div
      data-testid={`mock-upload-card-${title?.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {children}
    </div>
  )),
}));
jest.mock("@/components/rnd/chatbot/UploadResultDisplay", () => ({
  UploadResultDisplay: jest.fn(({ result }) =>
    result ? (
      <div data-testid="mock-upload-result">Result Displayed</div>
    ) : null,
  ),
}));
jest.mock("@/components/rnd/chatbot/FileUploadInput", () => ({
  FileUploadInput: jest.fn(({ fileToUpload }) => (
    <div data-testid="mock-file-upload-input">
      {fileToUpload ? `Selected: ${fileToUpload.name}` : "No file selected"}
    </div>
  )),
}));
jest.mock("@/components/rnd/chatbot/UploadActionButtons", () => ({
  // Update mock to render actual buttons
  UploadActionButtons: jest.fn(({ disabled }) => (
    <div data-testid="mock-upload-action-buttons">
      <button disabled={disabled} type="button">
        Add New
      </button>
      <button disabled={disabled} type="button">
        Update Existing
      </button>
    </div>
  )),
}));

// Mock heroui components used directly in UploadsUtilityDashboard
jest.mock("@heroui/react", () => {
  const originalModule = jest.requireActual("@heroui/react");

  return {
    ...originalModule, // Keep original exports if needed, or mock specific ones
    Input: jest.fn(
      ({
        // Destructure classNames as _classNames to indicate it's intentionally unused
        classNames: _classNames,
        ...props
      }) => <input data-testid="mock-heroui-input" {...props} />,
    ),
    Switch: jest.fn(({ children }) => (
      <div data-testid="mock-heroui-switch">{children}</div>
    )),
    // Add mocks for other heroui components if needed by the dashboard directly
  };
});

// Mock data
const mockPdfFile = new File(["pdf content"], "test.pdf", {
  type: "application/pdf",
});
const mockJsonFile = new File(["json content"], "test.json", {
  type: "application/json",
});

const mockAddResult: AddDocumentsResponse = {
  status: "success",
  filename: "test.pdf",
  store_metadata: {
    nb_collections: 1,
    details: { collection1: { count: 10 } },
  },
  added_count: 5,
  skipped_count: 2,
  skipped_sources: ["source1"],
};

const mockUpdateResult: UpdateDocumentsResponse = {
  status: "success",
  filename: "test.json",
  store_metadata: {
    nb_collections: 1,
    details: { collection1: { count: 10 } },
  },
  added_count: 3,
  docs_replaced: 7,
  sources_updated: 1,
};

describe("UploadsUtilityDashboard", () => {
  // Access the mocked hooks with correct typing
  const useFileUploadMock = FileUploadHook.useFileUpload as jest.Mock;
  const useWebUploadMock = WebUploadHook.useWebUpload as jest.Mock;

  // Setup default mock implementations
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Default mock implementation for PDF uploads
    useFileUploadMock.mockImplementation((sourceType) => {
      if (sourceType === "pdf") {
        return {
          fileToUpload: null,
          uploading: false,
          uploadError: null,
          uploadOperation: "add",
          uploadProgress: 0,
          uploadResult: null,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      } else {
        // For JSON/Setics
        return {
          fileToUpload: null,
          uploading: false,
          uploadError: null,
          uploadOperation: "add",
          uploadProgress: 0,
          uploadResult: null,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      }
    });

    // Default mock implementation for web uploads
    useWebUploadMock.mockReturnValue({
      urlToProcess: "",
      processing: false,
      error: null,
      operation: "add",
      withImages: false,
      uploadResult: null,
      setUrlToProcess: jest.fn(),
      setWithImages: jest.fn(),
      handleUrlSubmit: jest.fn(),
    });
  });

  it("renders all three upload cards", () => {
    render(<UploadsUtilityDashboard />);

    // Check that the mocked cards are rendered
    expect(
      screen.getByTestId("mock-upload-card-pdf-document"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-upload-card-web-document"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-upload-card-setics-document"),
    ).toBeInTheDocument();

    // Check that child components inside the cards are rendered (using their mocks)
    // Example: Check if FileUploadInput mock is rendered inside the PDF card
    const pdfCard = screen.getByTestId("mock-upload-card-pdf-document");

    expect(pdfCard).toContainElement(
      screen.getAllByTestId("mock-file-upload-input")[0],
    );
    expect(pdfCard).toContainElement(
      screen.getAllByTestId("mock-upload-action-buttons")[0],
    );
  });

  it("displays selected PDF file when available", () => {
    useFileUploadMock.mockImplementation((sourceType) => {
      if (sourceType === "pdf") {
        return {
          fileToUpload: mockPdfFile, // Use mock file
          uploading: false,
          uploadError: null,
          uploadOperation: "add",
          uploadProgress: 0,
          uploadResult: null,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      } else {
        return {
          fileToUpload: null,
          uploading: false,
          uploadError: null,
          uploadOperation: "add",
          uploadProgress: 0,
          uploadResult: null,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      }
    });

    render(<UploadsUtilityDashboard />);

    // Check the text rendered by the mocked FileUploadInput
    expect(screen.getAllByText("Selected: test.pdf")[0]).toBeInTheDocument();
  });

  it("displays selected JSON file when available", () => {
    useFileUploadMock.mockImplementation((sourceType) => {
      if (sourceType === "setics") {
        return {
          fileToUpload: mockJsonFile,
          uploading: false,
          uploadError: null,
          uploadOperation: "add",
          uploadProgress: 0,
          uploadResult: null,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      } else {
        return {
          fileToUpload: null,
          uploading: false,
          uploadError: null,
          uploadOperation: "add",
          uploadProgress: 0,
          uploadResult: null,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      }
    });

    render(<UploadsUtilityDashboard />);

    expect(screen.getByText("Selected: test.json")).toBeInTheDocument();
  });

  it("displays selected web URL when available", () => {
    useWebUploadMock.mockReturnValue({
      urlToProcess: "https://example.com",
      processing: false,
      error: null,
      operation: "add",
      withImages: false,
      uploadResult: null,
      setUrlToProcess: jest.fn(),
      setWithImages: jest.fn(),
      handleUrlSubmit: jest.fn(),
    });

    render(<UploadsUtilityDashboard />);

    expect(
      screen.getByText("Selected: https://example.com"),
    ).toBeInTheDocument();
  });

  it("displays PDF upload results when available", () => {
    useFileUploadMock.mockImplementation((sourceType) => {
      if (sourceType === "pdf") {
        return {
          fileToUpload: null,
          uploading: false,
          uploadError: null,
          uploadOperation: "add",
          uploadProgress: 0,
          uploadResult: mockAddResult,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      } else {
        return {
          fileToUpload: null,
          uploading: false,
          uploadError: null,
          uploadOperation: "add",
          uploadProgress: 0,
          uploadResult: null,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      }
    });

    render(<UploadsUtilityDashboard />);

    // Check if the mocked UploadResultDisplay is rendered
    expect(screen.getAllByTestId("mock-upload-result")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Result Displayed")[0]).toBeInTheDocument();
  });

  it("displays JSON upload results when available", () => {
    useFileUploadMock.mockImplementation((sourceType) => {
      if (sourceType === "setics") {
        return {
          fileToUpload: null,
          uploading: false,
          uploadError: null,
          uploadOperation: "update",
          uploadProgress: 0,
          uploadResult: mockUpdateResult,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      } else {
        return {
          fileToUpload: null,
          uploading: false,
          uploadError: null,
          uploadOperation: "add",
          uploadProgress: 0,
          uploadResult: null,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      }
    });

    render(<UploadsUtilityDashboard />);

    expect(screen.getAllByTestId("mock-upload-result")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Result Displayed")[0]).toBeInTheDocument();
  });

  it("displays web upload results when available", () => {
    useWebUploadMock.mockReturnValue({
      urlToProcess: "",
      processing: false,
      error: null,
      operation: "add",
      withImages: true,
      uploadResult: {
        ...mockAddResult,
        filename: "https://example.com",
      },
      setUrlToProcess: jest.fn(),
      setWithImages: jest.fn(),
      handleUrlSubmit: jest.fn(),
    });

    render(<UploadsUtilityDashboard />);

    expect(screen.getAllByTestId("mock-upload-result")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Result Displayed")[0]).toBeInTheDocument();
  });

  it("displays PDF upload error when present", () => {
    useFileUploadMock.mockImplementation((sourceType) => {
      if (sourceType === "pdf") {
        return {
          fileToUpload: null,
          uploading: false,
          uploadError: "Failed to upload PDF",
          uploadOperation: "add",
          uploadProgress: 0,
          uploadResult: null,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      } else {
        return {
          fileToUpload: null,
          uploading: false,
          uploadError: null,
          uploadOperation: "add",
          uploadProgress: 0,
          uploadResult: null,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      }
    });

    render(<UploadsUtilityDashboard />);

    expect(screen.getByText("Failed to upload PDF")).toBeInTheDocument();
  });

  it("displays JSON upload error when present", () => {
    useFileUploadMock.mockImplementation((sourceType) => {
      if (sourceType === "setics") {
        return {
          fileToUpload: null,
          uploading: false,
          uploadError: "Failed to upload JSON",
          uploadOperation: "add",
          uploadProgress: 0,
          uploadResult: null,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      } else {
        return {
          fileToUpload: null,
          uploading: false,
          uploadError: null,
          uploadOperation: "add",
          uploadProgress: 0,
          uploadResult: null,
          inputRef: { current: document.createElement("input") },
          handleFileChange: jest.fn(),
          handleFileUpload: jest.fn(),
        };
      }
    });

    render(<UploadsUtilityDashboard />);

    expect(screen.getByText("Failed to upload JSON")).toBeInTheDocument();
  });

  it("displays web URL error when present", () => {
    useWebUploadMock.mockReturnValue({
      urlToProcess: "",
      processing: false,
      error: "Invalid URL format",
      operation: "add",
      withImages: false,
      uploadResult: null,
      setUrlToProcess: jest.fn(),
      setWithImages: jest.fn(),
      handleUrlSubmit: jest.fn(),
    });

    render(<UploadsUtilityDashboard />);

    expect(screen.getByText("Invalid URL format")).toBeInTheDocument();
  });

  it('shows "include images" switch for web uploads', () => {
    render(<UploadsUtilityDashboard />);

    expect(
      screen.getByText("Include images in processing"),
    ).toBeInTheDocument();
  });

  it("disables PDF upload buttons when no file is selected", () => {
    render(<UploadsUtilityDashboard />);

    // Find buttons within the mocked action buttons component inside the PDF card
    const pdfCard = screen.getByTestId("mock-upload-card-pdf-document");
    const actionButtonsContainer = pdfCard.querySelector(
      '[data-testid="mock-upload-action-buttons"]',
    );
    const buttons = actionButtonsContainer
      ? actionButtonsContainer.querySelectorAll("button")
      : [];

    expect(buttons.length).toBe(2);
    // Check the disabled state based on the mock implementation
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });

  it("disables Setics upload buttons when no file is selected", () => {
    render(<UploadsUtilityDashboard />);

    // Find buttons within the mocked action buttons component inside the Setics card
    const seticsCard = screen.getByTestId("mock-upload-card-setics-document");
    const actionButtonsContainer = seticsCard.querySelector(
      '[data-testid="mock-upload-action-buttons"]',
    );
    const buttons = actionButtonsContainer
      ? actionButtonsContainer.querySelectorAll("button")
      : [];

    expect(buttons.length).toBe(2);
    // Check the disabled state based on the mock implementation
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });

  it("disables web upload buttons when no URL is entered", () => {
    render(<UploadsUtilityDashboard />);

    // Find buttons within the mocked action buttons component inside the Web card
    const webCard = screen.getByTestId("mock-upload-card-web-document");
    const actionButtonsContainer = webCard.querySelector(
      '[data-testid="mock-upload-action-buttons"]',
    );
    const buttons = actionButtonsContainer
      ? actionButtonsContainer.querySelectorAll("button")
      : [];

    expect(buttons.length).toBe(2);
    // Check the disabled state based on the mock implementation
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });
});
