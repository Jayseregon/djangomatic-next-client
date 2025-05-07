import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FileUp } from "lucide-react";

import { FileUploadInput } from "@/components/rnd/chatbot/FileUploadInput";

describe("FileUploadInput", () => {
  const mockHandleFileChange = jest.fn();

  const defaultProps = {
    accept: ".pdf",
    icon: <FileUp data-testid="file-icon" size={18} />,
    inputRef: React.createRef<HTMLInputElement>(),
    handleFileChange: mockHandleFileChange,
    fileToUpload: null,
    uploadProgress: 0,
    uploading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with correct props", () => {
    render(<FileUploadInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("accept", ".pdf");

    const icon = screen.getByTestId("file-icon");

    expect(icon).toBeInTheDocument();
  });

  it("does not show selected file name when no file is selected", () => {
    render(<FileUploadInput {...defaultProps} />);

    expect(screen.queryByText(/Selected:/)).not.toBeInTheDocument();
  });

  it("shows selected file name when a file is selected", () => {
    const fileToUpload = new File(["test content"], "test-document.pdf", {
      type: "application/pdf",
    });

    render(<FileUploadInput {...defaultProps} fileToUpload={fileToUpload} />);

    expect(screen.getByText(/Selected: test-document.pdf/)).toBeInTheDocument();
  });

  it("does not show progress bar when not uploading", () => {
    render(<FileUploadInput {...defaultProps} />);

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("does not show progress bar when uploading but progress is 0", () => {
    render(
      <FileUploadInput {...defaultProps} uploadProgress={0} uploading={true} />,
    );

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("shows progress bar when uploading and progress > 0", () => {
    render(
      <FileUploadInput
        {...defaultProps}
        uploadProgress={50}
        uploading={true}
      />,
    );

    const progressBar = screen.getByRole("progressbar");

    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveTextContent("50%");
  });

  it("calls handleFileChange when file is selected", () => {
    render(<FileUploadInput {...defaultProps} />);

    const input = screen.getByRole("searchbox");

    // Create a test file and a fake change event
    const file = new File(["test content"], "test-document.pdf", {
      type: "application/pdf",
    });
    const changeEvent = {
      target: {
        files: [file],
      },
    };

    // Simulate file selection
    fireEvent.change(input, changeEvent);

    expect(mockHandleFileChange).toHaveBeenCalledTimes(1);
    expect(mockHandleFileChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          files: expect.arrayContaining([file]),
        }),
      }),
    );
  });

  it("forwards the ref to the input element", () => {
    const ref = React.createRef<HTMLInputElement>();

    render(<FileUploadInput {...defaultProps} inputRef={ref} />);

    // Check that the ref points to the input element
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("INPUT");
  });
});
