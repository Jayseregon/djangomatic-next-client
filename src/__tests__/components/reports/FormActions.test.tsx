import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { FormActions } from "@/src/components/reports/FormActions";

describe("FormActions", () => {
  const defaultProps = {
    isNew: true,
    onSaveAndContinue: jest.fn(),
    onCancel: jest.fn(),
    onGeneratePDF: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders basic buttons", () => {
    render(<FormActions {...defaultProps} />);

    // Check for save buttons and cancel button
    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(3); // Save, SaveAndContinue, Cancel
  });

  it("renders PDF button when not new and onGeneratePDF provided", () => {
    render(<FormActions {...defaultProps} isNew={false} />);

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(4); // Save, SaveAndContinue, Generate PDF, Cancel
  });

  it("does not render PDF button when isNew is true", () => {
    render(<FormActions {...defaultProps} isNew={true} />);

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(3); // PDF button should not be present
  });

  it("calls onSaveAndContinue when save and continue button clicked", () => {
    render(<FormActions {...defaultProps} />);

    const saveAndContinueButton = screen.getByLabelText("save");

    fireEvent.click(saveAndContinueButton);

    expect(defaultProps.onSaveAndContinue).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button clicked", () => {
    render(<FormActions {...defaultProps} />);

    const cancelButton = screen.getByLabelText("circle-off");

    fireEvent.click(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onGeneratePDF when PDF button clicked", () => {
    render(<FormActions {...defaultProps} isNew={false} />);

    const pdfButton = screen.getByLabelText("file-text");

    fireEvent.click(pdfButton);

    expect(defaultProps.onGeneratePDF).toHaveBeenCalledTimes(1);
  });

  it("has correct button colors", () => {
    render(<FormActions {...defaultProps} isNew={false} />);

    const buttons = screen.getAllByRole("button");

    expect(buttons[0]).toHaveAttribute("color", "success"); // Save button
    expect(buttons[1]).toHaveAttribute("color", "success"); // Save and Continue
    expect(buttons[2]).toHaveAttribute("color", "primary"); // PDF
    expect(buttons[3]).toHaveAttribute("color", "danger"); // Cancel
  });

  it("has correct button variants", () => {
    render(<FormActions {...defaultProps} isNew={false} />);

    const saveAndContinueButton = screen.getByLabelText("save");
    const pdfButton = screen.getByLabelText("file-text");
    const cancelButton = screen.getByLabelText("circle-off");

    expect(saveAndContinueButton).toHaveAttribute("variant", "bordered");
    expect(pdfButton).toHaveAttribute("variant", "bordered");
    expect(cancelButton).toHaveAttribute("variant", "bordered");
  });
});
