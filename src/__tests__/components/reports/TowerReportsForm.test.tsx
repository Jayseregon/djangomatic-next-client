import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import { TowerReportForm } from "@/components/reports/TowerReportsForm";
import { getQuickbaseReportData } from "@/actions/quickbase/action";
import { INITIAL_FORM_STATE } from "@/config/towerReportConfig";

// Mock the server action
jest.mock("@/actions/quickbase/action", () => ({
  getQuickbaseReportData: jest.fn(),
}));

// Mock child components
jest.mock("@/components/reports/imageUpload/ImageUpload", () => ({
  __esModule: true,
  default: ({ onNewImageUpload, onImagesChange }: any) => (
    <div data-testid="image-upload">
      <button
        onClick={() =>
          onNewImageUpload({ id: "1", url: "test.jpg", label: "test" })
        }
      >
        Add Image
      </button>
      <button onClick={() => onImagesChange([])}>Change Images</button>
    </div>
  ),
}));

jest.mock("@/components/docs/DocLinkButton", () => ({
  __esModule: true,
  default: () => <div data-testid="doc-link">Doc Link</div>,
}));

describe("TowerReportForm Component", () => {
  const mockOnSave = jest.fn();
  const mockOnLocalSave = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    onSave: mockOnSave,
    onLocalSave: mockOnLocalSave,
    onCancel: mockOnCancel,
    isNew: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial form state correctly", () => {
    render(<TowerReportForm {...defaultProps} />);

    // Use getByRole with name for Work Order input
    expect(
      screen.getByRole("textbox", { name: /work order/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search qb/i })).toBeDisabled();
  });

  it("enables QB search when work order length is valid", async () => {
    render(<TowerReportForm {...defaultProps} />);

    const workOrderInput = screen.getByRole("textbox", { name: /work order/i });

    await userEvent.type(workOrderInput, "123456");

    expect(screen.getByRole("button", { name: /search qb/i })).toBeEnabled();
  });

  it("calls getQuickbaseReportData when searching QB", async () => {
    const mockQBData = {
      "1141": "TEST-JOB",
      "1114": "Test Site",
      // ...add other required QB fields
    };

    (getQuickbaseReportData as jest.Mock).mockResolvedValueOnce(mockQBData);

    render(<TowerReportForm {...defaultProps} />);

    const workOrderInput = screen.getByRole("textbox", { name: /work order/i });

    await userEvent.type(workOrderInput, "123456");
    await userEvent.click(screen.getByRole("button", { name: /search qb/i }));

    expect(getQuickbaseReportData).toHaveBeenCalledWith("123456");
  });

  it("updates form data when QB data is fetched", async () => {
    const mockQBData = {
      "1141": "TEST-JOB",
      "1114": "Test Site",
      // ...add other required QB fields
    };

    (getQuickbaseReportData as jest.Mock).mockResolvedValueOnce(mockQBData);

    render(<TowerReportForm {...defaultProps} />);

    const workOrderInput = screen.getByRole("textbox", { name: /work order/i });

    await userEvent.type(workOrderInput, "123456");
    await userEvent.click(screen.getByRole("button", { name: /search qb/i }));

    await waitFor(() => {
      expect(screen.getByDisplayValue("TEST-JOB")).toBeInTheDocument();
    });
  });

  it("handles form submission correctly", async () => {
    const mockReport = {
      ...INITIAL_FORM_STATE,
      jde_work_order: "123456",
      jde_job: "TEST-JOB",
    };

    render(<TowerReportForm {...defaultProps} report={mockReport} />);

    const form = screen.getByRole("form");

    await userEvent.type(
      screen.getByRole("textbox", { name: /work order/i }),
      "123456",
    );

    // Submit the form directly
    await userEvent.click(screen.getByTestId("save-all"));
    fireEvent.submit(form);

    expect(mockOnSave).toHaveBeenCalled();
  });

  it("handles local save correctly", async () => {
    mockOnLocalSave.mockResolvedValueOnce({
      success: true,
      isNewReport: false,
      response: {
        message: "Saved successfully",
        id: "1",
        updatedAt: new Date(),
      },
    });

    render(<TowerReportForm {...defaultProps} />);

    // Use testid to find the save button
    const saveButton = screen.getByTestId("save");

    await userEvent.click(saveButton);

    expect(mockOnLocalSave).toHaveBeenCalled();
  });

  it("handles cancellation correctly", async () => {
    render(<TowerReportForm {...defaultProps} />);

    // Use testid to find the cancel button
    const cancelButton = screen.getByTestId("circle-off");

    await userEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("loads existing report data correctly", () => {
    const mockReport = {
      ...INITIAL_FORM_STATE,
      jde_work_order: "123456",
      jde_job: "TEST-JOB",
      site_name: "Test Site",
    };

    render(<TowerReportForm {...defaultProps} report={mockReport} />);

    expect(screen.getByDisplayValue("123456")).toBeInTheDocument();
    expect(screen.getByDisplayValue("TEST-JOB")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Site")).toBeInTheDocument();
  });

  it("handles image uploads correctly", async () => {
    render(<TowerReportForm {...defaultProps} />);

    const workOrderInput = screen.getByRole("textbox", { name: /work order/i });

    await userEvent.type(workOrderInput, "123456");

    // Find button using text content since it's part of the mocked component
    const addImageButton = screen.getByText("Add Image");

    await userEvent.click(addImageButton);

    expect(screen.getAllByTestId("image-upload")).toHaveLength(1);
  });

  it("displays error toast on failed save", async () => {
    mockOnLocalSave.mockResolvedValueOnce({
      success: false,
      response: { message: "Save failed", id: "", updatedAt: new Date() },
    });

    render(<TowerReportForm {...defaultProps} />);

    // Use testid to find the save button
    const saveButton = screen.getByTestId("save");

    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Save failed")).toBeInTheDocument();
    });
  });
});
