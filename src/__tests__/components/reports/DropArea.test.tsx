import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { DropArea } from "@/src/components/reports/DropArea";

describe("DropArea", () => {
  const defaultProps = {
    onFilesAdded: jest.fn(),
    isDisabled: false,
    index: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<DropArea {...defaultProps} />);

    expect(
      screen.getByText("Drag & drop a file here, or click to browse"),
    ).toBeInTheDocument();
    const button = screen.getByTestId("drop-button");

    expect(button).not.toBeDisabled();
  });

  it("renders in disabled state", () => {
    render(<DropArea {...defaultProps} isDisabled={true} />);

    const button = screen.getByTestId("drop-button");

    expect(button).toBeDisabled();
    expect(screen.getByTestId("drop-area")).toHaveClass("cursor-not-allowed");
  });

  it("handles drag events correctly", () => {
    render(<DropArea {...defaultProps} />);
    const dropArea = screen.getByTestId("drop-area");

    // Test drag over
    fireEvent.dragOver(dropArea);
    expect(dropArea).toHaveClass("border-emerald-700");

    // Test drag leave
    fireEvent.dragLeave(dropArea);
    expect(dropArea).not.toHaveClass("border-emerald-700");
  });

  it("handles file drop correctly", () => {
    render(<DropArea {...defaultProps} />);
    const dropArea = screen.getByTestId("drop-area");

    const file = new File(["test"], "test.png", { type: "image/png" });
    const dataTransfer = {
      files: [file],
      clearData: jest.fn(),
    };

    fireEvent.drop(dropArea, { dataTransfer });

    expect(defaultProps.onFilesAdded).toHaveBeenCalledWith([file]);
    expect(dataTransfer.clearData).toHaveBeenCalled();
  });

  it("handles file input change", () => {
    render(<DropArea {...defaultProps} />);

    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input-0");

    Object.defineProperty(input, "files", {
      value: [file],
    });

    fireEvent.change(input);

    expect(defaultProps.onFilesAdded).toHaveBeenCalledWith([file]);
  });

  it("handles keyboard events", () => {
    render(<DropArea {...defaultProps} />);
    const dropArea = screen.getByTestId("drop-area");

    // Test Enter key
    fireEvent.keyDown(dropArea, { key: "Enter" });
    expect(defaultProps.onFilesAdded).not.toHaveBeenCalled();

    // Test Space key
    fireEvent.keyDown(dropArea, { key: " " });
    expect(defaultProps.onFilesAdded).not.toHaveBeenCalled();
  });

  it("ignores keyboard events when disabled", () => {
    render(<DropArea {...defaultProps} isDisabled={true} />);
    const dropArea = screen.getByTestId("drop-area");

    fireEvent.keyDown(dropArea, { key: "Enter" });
    fireEvent.keyDown(dropArea, { key: " " });

    expect(defaultProps.onFilesAdded).not.toHaveBeenCalled();
  });
});
