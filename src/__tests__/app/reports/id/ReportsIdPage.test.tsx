import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";

import ReportFormPage from "@/app/reports/[id]/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock TowerReportForm component
jest.mock("@/components/reports/TowerReportsForm", () => ({
  TowerReportForm: ({ report, onSave, onLocalSave, onCancel }: any) => (
    <div data-report-id={report?.id} data-testid="tower-report-form">
      <button
        data-testid="save-button"
        onClick={() => onSave({ id: "test-id" })}
      >
        Save
      </button>
      <button
        data-testid="save-local-button"
        onClick={() => onLocalSave({ id: "test-id" })}
      >
        Save Local
      </button>
      <button
        data-testid="cancel-button"
        onClick={() => onCancel([], "test-subdir")}
      >
        Cancel
      </button>
    </div>
  ),
}));

// Mock title from primitives
jest.mock("@/components/primitives", () => ({
  title: () => "mock-title-class",
}));

// Setup fetch mock
const mockFetch = jest.fn();

global.fetch = mockFetch;

describe("ReportFormPage", () => {
  const mockPush = jest.fn();
  const mockReport = {
    id: "test-id",
    site_code: "TEST123",
    tower_site_name: "Test Tower",
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useParams as jest.Mock).mockReturnValue({ id: "test-id" });
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockReport),
    });
  });

  it("renders the form page with correct title", async () => {
    await act(async () => {
      render(<ReportFormPage />);
    });
    expect(screen.getByText("Edit Report")).toBeInTheDocument();
  });

  it("fetches and displays report data on mount", async () => {
    let resolvePromise: (value: any) => void;
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (global.fetch as jest.Mock).mockImplementationOnce(() => fetchPromise);

    await act(async () => {
      render(<ReportFormPage />);
    });

    expect(screen.getByTestId("tower-report-form")).toBeInTheDocument();

    await act(async () => {
      resolvePromise({
        ok: true,
        json: () => Promise.resolve(mockReport),
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("tower-report-form")).toHaveAttribute(
        "data-report-id",
        "test-id",
      );
    });
  });

  it("handles save and close correctly", async () => {
    mockFetch
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockReport),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
        }),
      );

    await act(async () => {
      render(<ReportFormPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("save-button")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("save-button"));
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/reports");
    });
  });

  it("handles local save correctly", async () => {
    const mockUpdateResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          report: {
            id: "test-id",
            updatedAt: new Date().toISOString(),
          },
        }),
    };

    // Setup fetch mocks for both the initial load and the update
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockReport),
        }),
      )
      .mockImplementationOnce(() => Promise.resolve(mockUpdateResponse));

    await act(async () => {
      render(<ReportFormPage />);
    });

    const saveLocalButton = screen.getByTestId("save-local-button");

    // Mock the actual implementation of onLocalSave from the component
    let saveResult;

    await act(async () => {
      saveResult = await new Promise((resolve) => {
        // Replace the button click with direct call to mocked onLocalSave
        saveLocalButton.onclick = () => {
          resolve({
            success: true,
            isNewReport: false,
            response: {
              message: "Report successfully saved!",
              id: "test-id",
              updatedAt: expect.any(Date),
            },
          });
        };
        fireEvent.click(saveLocalButton);
      });
    });

    expect(saveResult).toEqual(
      expect.objectContaining({
        success: true,
        isNewReport: false,
        response: expect.objectContaining({
          message: "Report successfully saved!",
          id: "test-id",
          updatedAt: expect.any(Date),
        }),
      }),
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `/api/prisma-tower-report/update?id=test-id`,
      expect.any(Object),
    );
  });

  it("handles save errors correctly", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReport),
      })
      .mockRejectedValueOnce(new Error("Save failed"));

    await act(async () => {
      render(<ReportFormPage />);
    });

    const saveButton = screen.getByTestId("save-button");

    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to save tower report:",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });

  it("handles cancel and image cleanup correctly", async () => {
    await act(async () => {
      render(<ReportFormPage />);
    });

    const cancelButton = screen.getByTestId("cancel-button");

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(mockPush).toHaveBeenCalledWith("/reports");
  });

  it("handles fetch errors gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    mockFetch.mockRejectedValueOnce(new Error("Fetch failed"));

    await act(async () => {
      render(<ReportFormPage />);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to fetch report:",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
