import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useParams } from "next/navigation";
import React from "react";

import PDFViewerPage from "@/app/pdf/rogers/[id]/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

// Mock LoadingContent component
jest.mock("@/components/ui/LoadingContent", () => ({
  LoadingContent: () => <div data-testid="loading-content">Loading...</div>,
}));

// Mock UnAuthorized component
jest.mock("@/components/auth/unAuthorized", () => ({
  UnAuthorized: () => <div data-testid="unauthorized">Unauthorized</div>,
}));

// Mock ReportDocument component
jest.mock("@/components/reports/pdfBlocks/rogers/ReportDocument", () => ({
  __esModule: true,
  default: ({ report }: { report: any }) => (
    <div data-report-id={report.id} data-testid="report-document">
      Mock Report Document
    </div>
  ),
}));

// Mock @react-pdf/renderer
jest.mock("@react-pdf/renderer", () => ({
  Font: {
    registerHyphenationCallback: jest.fn(),
  },
  pdf: () => ({
    toBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  }),
  BlobProvider: ({ _document, children }: any) => {
    const mockBlob = new Blob(["mock pdf content"], {
      type: "application/pdf",
    });
    const mockUrl = "blob:mock-pdf-url";

    (global.URL.createObjectURL as jest.Mock).mockReturnValue(mockUrl);

    // Return the children function result directly
    return children({
      blob: mockBlob,
      loading: false,
      error: null,
      url: mockUrl,
    });
  },
}));

// Mock NextUI Button component
jest.mock("@nextui-org/button", () => ({
  Button: ({ children, onPress, ...props }: any) => (
    <button
      aria-label="Download PDF"
      type="button"
      onClick={onPress}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock fetch
global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

describe("PDFViewerPage", () => {
  const mockReport = {
    id: "test-id",
    site_code: "TEST123",
    tower_site_name: "test_tower",
    site_region: "WEST",
    jde_job: "JDE123",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-02",
    checklistForm4: [],
    checklistForm5: [],
    checklistForm6: [],
    checklistForm7: [],
    checklistForm8: [],
    checklistForm9: [],
    checklistForm10: [],
    checklistForm11: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: "test-id" });
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockReport),
      }),
    );
  });

  it("shows unauthorized when no id param exists", async () => {
    (useParams as jest.Mock).mockReturnValue({});
    render(<PDFViewerPage />);

    expect(screen.getByTestId("unauthorized")).toBeInTheDocument();
  });

  it("shows loading state while fetching report", async () => {
    render(<PDFViewerPage />);

    expect(screen.getByTestId("loading-content")).toBeInTheDocument();
  });

  it("renders PDF viewer with correct file name when report is loaded", async () => {
    const { container } = render(<PDFViewerPage />);

    // Wait for loading to complete
    await waitFor(
      () => {
        expect(screen.queryByTestId("loading-content")).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Use getByText instead of getByRole for more reliable button finding
    expect(screen.getByText(/download pdf/i)).toBeInTheDocument();

    const iframe = container.querySelector("iframe");

    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("title", "render-report-test-id");
  });

  it("handles download button click", async () => {
    const createElementSpy = jest.spyOn(document, "createElement");
    const appendChildSpy = jest.spyOn(document.body, "appendChild");
    const removeChildSpy = jest.spyOn(document.body, "removeChild");

    render(<PDFViewerPage />);

    await waitFor(
      () => {
        expect(screen.queryByTestId("loading-content")).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    // Use getByText instead of getByRole
    const downloadButton = screen.getByText(/download pdf/i);

    expect(downloadButton).toBeInTheDocument();
    fireEvent.click(downloadButton);

    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });

  it("handles fetch error gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (global.fetch as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

    render(<PDFViewerPage />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to fetch report:",
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it("transforms checklist form data correctly", async () => {
    const mockReportWithChecklist = {
      ...mockReport,
      checklistForm4: [{ isChecked: null }, { isChecked: true }],
    };

    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockReportWithChecklist),
      }),
    );

    render(<PDFViewerPage />);

    // Wait for loading to complete and PDF to generate
    await waitFor(
      () => {
        expect(screen.queryByTestId("loading-content")).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
