import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import "@testing-library/jest-dom";
import { FormInputRow } from "@/components/reports/imageUpload/FormInputRow";

// Mock the components used in FormInputRow
jest.mock("@/components/reports/DropArea", () => ({
  DropArea: ({ onFilesAdded, isDisabled }: any) => (
    <div
      data-disabled={isDisabled}
      data-testid="mock-drop-area"
      role="button"
      tabIndex={0}
      onClick={() => {
        const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
        const mockFileList = {
          0: mockFile,
          length: 1,
          item: () => mockFile,
        } as unknown as FileList;

        onFilesAdded(mockFileList);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          const mockFile = new File(["test"], "test.jpg", {
            type: "image/jpeg",
          });
          const mockFileList = {
            0: mockFile,
            length: 1,
            item: () => mockFile,
          } as unknown as FileList;

          onFilesAdded(mockFileList);
        }
      }}
    >
      Drop Area
    </div>
  ),
}));

jest.mock("@/components/ui/formInput", () => ({
  LabelInput: ({ value, onChange, placeholder, options }: any) => (
    <input
      data-options={JSON.stringify(options)}
      data-testid="mock-label-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  ),
  FormInput: ({ value, onChange, placeholder }: any) => (
    <input
      data-testid="mock-form-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  ),
  TrashButton: (
    { onPress }: any, // Change onClick to onPress
  ) => <button data-testid="mock-trash-button" onClick={onPress} />,
}));

// Update ImageRotateModal mock to properly handle file creation and passing
jest.mock("@/components/reports/imageUpload/ImageRotateModal", () => ({
  ImageRotateModal: ({ isOpen, onConfirm, onClose }: any) => {
    const handleConfirm = () => {
      const mockFile = new File(["rotated"], "rotated.jpg", {
        type: "image/jpeg",
      });

      onConfirm(mockFile);
    };

    const handleCancel = () => {
      onClose();
    };

    return isOpen ? (
      <div data-testid="mock-rotate-modal">
        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    ) : null;
  },
}));

describe("FormInputRow", () => {
  const defaultProps = {
    image: {
      imgIndex: 0,
      file: null,
      label: "",
      deficiency_check_procedure: "",
      deficiency_recommendation: "",
    },
    isDeficiency: false,
    labelOptions: ["Label 1", "Label 2"],
    labelPlaceholder: "Enter label",
    handleImageChange: jest.fn(),
    handleLabelChange: jest.fn(),
    handleDeficiencyCheckProcedureChange: jest.fn(),
    handleDeficiencyRecommendationChange: jest.fn(),
    removeImageField: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders standard form input row correctly", () => {
    render(<FormInputRow {...defaultProps} />);

    expect(screen.getByTestId("mock-drop-area")).toBeInTheDocument();
    expect(screen.getByTestId("mock-label-input")).toBeInTheDocument();
    expect(screen.getByTestId("mock-trash-button")).toBeInTheDocument();
  });

  it("renders deficiency form fields when isDeficiency is true", () => {
    render(<FormInputRow {...defaultProps} isDeficiency={true} />);

    const formInputs = screen.getAllByTestId("mock-form-input");

    expect(formInputs).toHaveLength(2); // Check procedure and recommendation
  });

  it("handles image upload and rotation modal", async () => {
    const mockHandleImageChange = jest.fn();

    render(
      <FormInputRow
        {...defaultProps}
        handleImageChange={mockHandleImageChange}
      />,
    );

    fireEvent.click(screen.getByTestId("mock-drop-area"));
    expect(screen.getByTestId("mock-rotate-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirm"));

    expect(mockHandleImageChange).toHaveBeenCalledWith(
      0,
      expect.objectContaining({
        length: 1,
        0: expect.any(File),
        item: expect.any(Function),
      }),
    );
  });

  it("handles image removal", () => {
    render(<FormInputRow {...defaultProps} />);

    fireEvent.click(screen.getByTestId("mock-trash-button"));

    expect(defaultProps.removeImageField).toHaveBeenCalledWith(0);
  });

  it("disables drop area appropriately for deficiency images", () => {
    const { rerender } = render(
      <FormInputRow {...defaultProps} isDeficiency={true} />,
    );

    expect(screen.getByTestId("mock-drop-area")).toHaveAttribute(
      "data-disabled",
      "true",
    );

    rerender(
      <FormInputRow
        {...defaultProps}
        image={{
          ...defaultProps.image,
          label: "Test",
          deficiency_check_procedure: "Test",
          deficiency_recommendation: "Test",
        }}
        isDeficiency={true}
      />,
    );

    expect(screen.getByTestId("mock-drop-area")).toHaveAttribute(
      "data-disabled",
      "false",
    );
  });

  it("handles front cover specific layout", () => {
    render(<FormInputRow {...defaultProps} isFrontcover={true} />);

    expect(screen.getByTestId("mock-drop-area")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-label-input")).not.toBeInTheDocument();
  });

  it("handles modal cancellation", () => {
    render(<FormInputRow {...defaultProps} />);

    fireEvent.click(screen.getByTestId("mock-drop-area"));
    expect(screen.getByTestId("mock-rotate-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByTestId("mock-rotate-modal")).not.toBeInTheDocument();
  });
});
