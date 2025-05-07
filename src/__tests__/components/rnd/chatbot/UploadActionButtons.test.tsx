import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { UploadActionButtons } from "@/components/rnd/chatbot/UploadActionButtons";
import { UploadOperation } from "@/interfaces/chatbot";

describe("UploadActionButtons", () => {
  const mockOnUpload = jest.fn();

  const defaultProps = {
    uploading: false,
    disabled: false,
    currentOperation: "add" as UploadOperation,
    onUpload: mockOnUpload,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders both buttons correctly", () => {
    render(<UploadActionButtons {...defaultProps} />);

    expect(screen.getByText("Add New")).toBeInTheDocument();
    expect(screen.getByText("Update Existing")).toBeInTheDocument();
  });

  it('calls onUpload with "add" when Add New button is clicked', () => {
    render(<UploadActionButtons {...defaultProps} />);

    fireEvent.click(screen.getByText("Add New"));

    expect(mockOnUpload).toHaveBeenCalledTimes(1);
    expect(mockOnUpload).toHaveBeenCalledWith("add");
  });

  it('calls onUpload with "update" when Update Existing button is clicked', () => {
    render(<UploadActionButtons {...defaultProps} />);

    fireEvent.click(screen.getByText("Update Existing"));

    expect(mockOnUpload).toHaveBeenCalledTimes(1);
    expect(mockOnUpload).toHaveBeenCalledWith("update");
  });

  it("disables both buttons when disabled prop is true", () => {
    render(<UploadActionButtons {...defaultProps} disabled={true} />);

    const addButton = screen.getByText("Add New").closest("button");
    const updateButton = screen.getByText("Update Existing").closest("button");

    expect(addButton).toBeDisabled();
    expect(updateButton).toBeDisabled();
  });

  it("disables both buttons when uploading is true", () => {
    render(<UploadActionButtons {...defaultProps} uploading={true} />);

    const buttons = screen.getAllByRole("button");
    const addButton = buttons[0]; // First button (Add New)
    const updateButton = buttons[1]; // Second button (Update Existing)

    expect(addButton).toBeDisabled();
    expect(updateButton).toBeDisabled();
  });

  it('shows spinner in the "add" button when uploading and currentOperation is "add"', () => {
    render(
      <UploadActionButtons
        {...defaultProps}
        currentOperation="add"
        uploading={true}
      />,
    );

    expect(screen.queryByText("Add New")).not.toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByText("Update Existing")).toBeInTheDocument();
  });

  it('shows spinner in the "update" button when uploading and currentOperation is "update"', () => {
    render(
      <UploadActionButtons
        {...defaultProps}
        currentOperation="update"
        uploading={true}
      />,
    );

    expect(screen.getByText("Add New")).toBeInTheDocument();
    expect(screen.queryByText("Update Existing")).not.toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("has correct button variants", () => {
    render(<UploadActionButtons {...defaultProps} />);

    const addButton = screen.getByText("Add New").closest("button");
    const updateButton = screen.getByText("Update Existing").closest("button");

    expect(addButton).toHaveClass("flex-1");
    expect(updateButton).toHaveClass("flex-1");
  });

  it("renders PlusCircle icon for Add New button", () => {
    render(<UploadActionButtons {...defaultProps} />);

    const addButton = screen.getByText("Add New").closest("button");

    // Check that the start content (icon) is rendered
    expect(addButton?.querySelector(".mr-2")).toBeInTheDocument();
  });

  it("renders RefreshCw icon for Update Existing button", () => {
    render(<UploadActionButtons {...defaultProps} />);

    const updateButton = screen.getByText("Update Existing").closest("button");

    // Check that the start content (icon) is rendered
    expect(updateButton?.querySelector(".mr-2")).toBeInTheDocument();
  });
});
