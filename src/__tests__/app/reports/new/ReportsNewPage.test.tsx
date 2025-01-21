import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";

import ReportFormPage from "@/app/reports/new/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock TowerReportForm component
jest.mock("@/components/reports/TowerReportsForm", () => ({
  TowerReportForm: ({ onSave, onLocalSave, onCancel }: any) => (
    <div data-testid="tower-report-form">
      <button data-testid="save-button" onClick={() => onSave({ id: "test" })}>
        Save
      </button>
      <button
        data-testid="save-local-button"
        onClick={() => onLocalSave({ id: "test" })}
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

describe("ReportFormPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    global.fetch = jest.fn();
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ report: { id: "test-id", updatedAt: new Date() } }),
      }),
    );
  });

  it("renders the form page with correct title", () => {
    render(<ReportFormPage />);

    expect(screen.getByText("New Report")).toBeInTheDocument();
    expect(screen.getByTestId("tower-report-form")).toBeInTheDocument();
  });

  it("handles save and close correctly", async () => {
    render(<ReportFormPage />);

    const saveButton = screen.getByTestId("save-button");

    await waitFor(() => {
      fireEvent.click(saveButton);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/prisma-tower-report/create",
      expect.any(Object),
    );
    expect(mockPush).toHaveBeenCalledWith("/reports");
  });

  it("handles local save correctly", async () => {
    render(<ReportFormPage />);

    const saveLocalButton = screen.getByTestId("save-local-button");

    await waitFor(() => {
      fireEvent.click(saveLocalButton);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/prisma-tower-report/create",
      expect.any(Object),
    );
    expect(mockPush).toHaveBeenCalledWith("/reports/test-id");
  });

  it("handles cancel correctly", async () => {
    render(<ReportFormPage />);

    const cancelButton = screen.getByTestId("cancel-button");

    await waitFor(() => {
      fireEvent.click(cancelButton);
    });

    expect(mockPush).toHaveBeenCalledWith("/reports");
  });

  it("handles save error correctly", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Save failed")),
    );

    render(<ReportFormPage />);

    const saveButton = screen.getByTestId("save-button");

    await waitFor(() => {
      fireEvent.click(saveButton);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to save tower report:",
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });

  it("saves notification to localStorage on successful local save", async () => {
    const mockDate = new Date().toISOString(); // Convert to ISO string

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            report: { id: "test-id", updatedAt: mockDate },
          }),
      }),
    );

    render(<ReportFormPage />);

    const saveLocalButton = screen.getByTestId("save-local-button");

    await waitFor(() => {
      fireEvent.click(saveLocalButton);
    });

    const storedNotification = JSON.parse(
      localStorage.getItem("reportNotification") || "{}",
    );

    expect(storedNotification).toEqual({
      message: "Report successfully created and saved!",
      id: "test-id",
      updatedAt: mockDate, // Compare with ISO string
    });
  });

  it("handles image deletion on cancel", async () => {
    const _mockImages = [{ azureId: "test-azure-id" }];

    render(<ReportFormPage />);

    (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve());

    const cancelButton = screen.getByTestId("cancel-button");

    await waitFor(() => {
      fireEvent.click(cancelButton);
    });

    expect(mockPush).toHaveBeenCalledWith("/reports");
  });
});
