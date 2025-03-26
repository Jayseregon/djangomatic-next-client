import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { EditCostModal } from "@/src/components/rnd/tracking/gains/EditCostModal";
import { CellEditData } from "@/src/interfaces/rnd";

// Create a custom mock for HeroUI components used in EditCostModal
jest.mock("@heroui/react", () => {
  return {
    Modal: ({ isOpen, children, ...props }: any) => {
      // Extract non-DOM props to avoid React warnings
      const { hideCloseButton, backdrop, size, classNames, ...domProps } =
        props;

      // Use variables in a non-functional way to avoid linting errors
      const modalStyles = hideCloseButton ? {} : {};
      const modalClassList = classNames || {};

      return isOpen ? (
        <div
          data-backdrop={backdrop}
          data-class-names={Object.keys(modalClassList).join(" ")}
          data-has-close={!hideCloseButton}
          data-size={size}
          data-testid="modal-component"
          style={Object.keys(modalStyles).length ? modalStyles : {}}
          {...domProps}
        >
          {children}
        </div>
      ) : null;
    },
    ModalContent: ({ children }: any) => (
      <div data-testid="modal-content">{children}</div>
    ),
    ModalHeader: ({ children }: any) => (
      <div data-testid="modal-header">{children}</div>
    ),
    ModalBody: ({ children }: any) => (
      <div data-testid="modal-body">{children}</div>
    ),
    ModalFooter: ({ children }: any) => (
      <div data-testid="modal-footer">{children}</div>
    ),
    Input: ({
      label,
      value,
      onChange,
      onClear,
      startContent,
      isInvalid,
      errorMessage,
      readOnly,
      ...props
    }: any) => {
      // Extract non-DOM props to avoid React warnings
      const { labelPlacement, classNames, isClearable, ...domProps } = props;

      // Use variables in a non-functional way to avoid linting errors
      const placement = labelPlacement || "outside";
      const inputClassList = classNames || {};

      return (
        <div
          data-classnames={Object.keys(inputClassList).join(" ")}
          data-placement={placement}
          data-testid={`input-${label?.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {startContent && <div data-testid="input-icon">{startContent}</div>}
          <label>{label}</label>
          <input
            data-invalid={isInvalid}
            readOnly={readOnly}
            value={value || ""}
            onChange={(e) => onChange && onChange(e)}
            {...domProps}
          />
          {isInvalid && errorMessage && (
            <div data-testid="error-message">{errorMessage}</div>
          )}
          {isClearable && value && !readOnly && (
            <button data-testid="clear-button" onClick={onClear}>
              Clear
            </button>
          )}
        </div>
      );
    },
    Button: ({
      "aria-label": ariaLabel,
      isDisabled,
      onPress,
      children,
      ...props
    }: any) => {
      // Extract non-DOM props
      const { isIconOnly, color, variant, ...domProps } = props;

      // Use variables in a non-functional way to avoid linting errors
      const buttonStyle = {
        padding: isIconOnly ? "8px" : "12px",
      };

      return (
        <button
          data-color={color}
          data-testid={`button-${ariaLabel?.toLowerCase().replace(/\s+/g, "-")}`}
          data-variant={variant}
          disabled={isDisabled}
          style={buttonStyle}
          onClick={onPress}
          {...domProps}
        >
          {children}
        </button>
      );
    },
  };
});

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  Save: () => <span data-testid="save-icon">SaveIcon</span>,
  CircleOff: () => <span data-testid="circle-off-icon">CircleOffIcon</span>,
  DollarSign: () => <span data-testid="dollar-sign-icon">DollarSignIcon</span>,
  Hash: () => <span data-testid="hash-icon">HashIcon</span>,
}));

describe("EditCostModal", () => {
  // Mock handlers
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockSetCount = jest.fn();
  const mockSetRate = jest.fn();
  const mockSetAdjustedCost = jest.fn();

  // Mock data
  const mockEditingCell: CellEditData = {
    month: "January",
    value: 1000,
    originalData: {
      month: "January",
      cost: 1000,
    },
  };

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    editingCell: mockEditingCell,
    count: "10",
    setCount: mockSetCount,
    rate: "100",
    setRate: mockSetRate,
    adjustedCost: "0",
    setAdjustedCost: mockSetAdjustedCost,
    subtotal: 1000,
    grandTotal: 1000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when open", () => {
    render(<EditCostModal {...defaultProps} />);

    // Check if modal is rendered
    expect(screen.getByTestId("modal-component")).toBeInTheDocument();

    // Check if header shows correct month
    expect(screen.getByTestId("modal-header")).toHaveTextContent(
      "Edit January Gain",
    );

    // Check if form fields have correct initial values - fix value type assertions
    const countInput = screen.getByTestId("input-count").querySelector("input");

    expect(countInput?.value.toString()).toBe("10");

    const rateInput = screen.getByTestId("input-rate").querySelector("input");

    expect(rateInput?.value.toString()).toBe("100");

    const adjustedCostInput = screen
      .getByTestId("input-adjusted-gain")
      .querySelector("input");

    expect(adjustedCostInput?.value.toString()).toBe("0");

    // Check if calculated values are displayed correctly
    const subtotalInput = screen
      .getByTestId("input-subtotal")
      .querySelector("input");

    expect(subtotalInput).toHaveValue("$1,000");
    expect(subtotalInput).toHaveAttribute("readOnly");

    const grandTotalInput = screen
      .getByTestId("input-grand-total")
      .querySelector("input");

    expect(grandTotalInput).toHaveValue("$1,000");
    expect(grandTotalInput).toHaveAttribute("readOnly");
  });

  it("does not render when isOpen is false", () => {
    render(<EditCostModal {...defaultProps} isOpen={false} />);

    // Modal should not be in the document
    expect(screen.queryByTestId("modal-component")).not.toBeInTheDocument();
  });

  it("updates count value when changed", () => {
    render(<EditCostModal {...defaultProps} />);

    // Find and update count input
    const countInput = screen.getByTestId("input-count").querySelector("input");

    fireEvent.change(countInput!, { target: { value: "20" } });

    // Check if setCount was called with new value
    expect(mockSetCount).toHaveBeenCalledWith("20");
  });

  it("updates rate value when changed", () => {
    render(<EditCostModal {...defaultProps} />);

    // Find and update rate input
    const rateInput = screen.getByTestId("input-rate").querySelector("input");

    fireEvent.change(rateInput!, { target: { value: "200" } });

    // Check if setRate was called with new value
    expect(mockSetRate).toHaveBeenCalledWith("200");
  });

  it("updates adjusted cost value when changed", () => {
    render(<EditCostModal {...defaultProps} />);

    // Find and update adjusted cost input
    const adjustedCostInput = screen
      .getByTestId("input-adjusted-gain")
      .querySelector("input");

    fireEvent.change(adjustedCostInput!, { target: { value: "500" } });

    // Check if setAdjustedCost was called with new value
    expect(mockSetAdjustedCost).toHaveBeenCalledWith("500");
  });

  it("clears input values when clear buttons are clicked", () => {
    render(<EditCostModal {...defaultProps} />);

    // Find and click clear buttons
    const countClearButton = screen
      .getByTestId("input-count")
      .querySelector('[data-testid="clear-button"]');

    fireEvent.click(countClearButton!);
    expect(mockSetCount).toHaveBeenCalledWith("");

    const rateClearButton = screen
      .getByTestId("input-rate")
      .querySelector('[data-testid="clear-button"]');

    fireEvent.click(rateClearButton!);
    expect(mockSetRate).toHaveBeenCalledWith("");

    const adjustedCostClearButton = screen
      .getByTestId("input-adjusted-gain")
      .querySelector('[data-testid="clear-button"]');

    fireEvent.click(adjustedCostClearButton!);
    expect(mockSetAdjustedCost).toHaveBeenCalledWith("");
  });

  it("validates count input and shows error for invalid values", () => {
    // Render with an invalid count value
    render(
      <EditCostModal
        {...defaultProps}
        count="-5" // Negative value should trigger error
      />,
    );

    // Check for error message
    const errorMessage = screen.getByTestId("error-message");

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Count cannot be negative");

    // Save button should be disabled
    const saveButton = screen.getByTestId("button-save-edit");

    expect(saveButton).toBeDisabled();
  });

  it("validates rate input and shows error for invalid values", () => {
    // Render with an invalid rate value
    render(
      <EditCostModal
        {...defaultProps}
        rate="abc" // Non-numeric value should trigger error
      />,
    );

    // Check for error message
    const errorMessage = screen.getByTestId("error-message");

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Rate must be a number");

    // Save button should be disabled
    const saveButton = screen.getByTestId("button-save-edit");

    expect(saveButton).toBeDisabled();
  });

  it("validates adjusted cost input and shows error for invalid values", () => {
    // Render with an invalid adjusted cost value
    render(
      <EditCostModal
        {...defaultProps}
        adjustedCost="xyz" // Non-numeric value should trigger error
      />,
    );

    // Check for error message
    const errorMessage = screen.getByTestId("error-message");

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Adjusted cost must be a number");

    // Save button should be disabled
    const saveButton = screen.getByTestId("button-save-edit");

    expect(saveButton).toBeDisabled();
  });

  it("enables save button when all inputs are valid", () => {
    render(<EditCostModal {...defaultProps} />);

    // Save button should be enabled with valid inputs
    const saveButton = screen.getByTestId("button-save-edit");

    expect(saveButton).not.toBeDisabled();
  });

  it("calls onSave when save button is clicked", () => {
    render(<EditCostModal {...defaultProps} />);

    // Find and click save button
    const saveButton = screen.getByTestId("button-save-edit");

    fireEvent.click(saveButton);

    // Check if onSave was called
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", () => {
    render(<EditCostModal {...defaultProps} />);

    // Find and click close button
    const closeButton = screen.getByTestId("button-close-modal");

    fireEvent.click(closeButton);

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("displays correct subtotal and grand total", () => {
    // Render with specific values to test calculation displays
    render(
      <EditCostModal
        {...defaultProps}
        adjustedCost="100"
        count="5"
        grandTotal={1100}
        rate="200"
        subtotal={1000}
      />,
    );

    // Check if calculated values are displayed correctly
    const subtotalInput = screen
      .getByTestId("input-subtotal")
      .querySelector("input");

    expect(subtotalInput).toHaveValue("$1,000");

    const grandTotalInput = screen
      .getByTestId("input-grand-total")
      .querySelector("input");

    expect(grandTotalInput).toHaveValue("$1,100");
  });

  it("displays empty string for subtotal and grand total when values are zero", () => {
    render(<EditCostModal {...defaultProps} grandTotal={0} subtotal={0} />);

    // Check if calculated values are displayed as empty strings when zero
    const subtotalInput = screen
      .getByTestId("input-subtotal")
      .querySelector("input");

    expect(subtotalInput).toHaveValue("");

    const grandTotalInput = screen
      .getByTestId("input-grand-total")
      .querySelector("input");

    expect(grandTotalInput).toHaveValue("");
  });
});
