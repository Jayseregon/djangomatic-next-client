import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@heroui/react";
import { ListPlus } from "lucide-react";

import { TriggerButton } from "@/components/rnd/TriggerButton";

// Mock dependencies
jest.mock("@heroui/react", () => ({
  Button: jest.fn(
    ({ children, onPress, isIconOnly, color, size, variant, ...props }) => (
      <button
        data-color={color}
        data-icon-only={isIconOnly}
        data-size={size}
        data-testid="mock-button"
        data-variant={variant}
        onClick={onPress}
        {...props}
      >
        {children}
      </button>
    ),
  ),
}));

jest.mock("lucide-react", () => ({
  ListPlus: jest.fn(() => (
    <div data-testid="list-plus-icon">ListPlus Icon</div>
  )),
}));

// Add TypeScript casting for the mocked components
const MockedButton = Button as unknown as jest.Mock;
const MockedListPlus = ListPlus as unknown as jest.Mock;

describe("TriggerButton", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a button with the correct props", () => {
    render(<TriggerButton onClick={mockOnClick} />);

    // Check Button was called
    expect(MockedButton).toHaveBeenCalled();

    // Get props from the first call
    const buttonProps = MockedButton.mock.calls[0][0];

    expect(buttonProps.isIconOnly).toBe(true);
    expect(buttonProps.color).toBe("success");
    expect(buttonProps.size).toBe("sm");
    expect(buttonProps.variant).toBe("bordered");
    expect(buttonProps.onPress).toBe(mockOnClick);

    // Verify button is rendered
    const button = screen.getByTestId("mock-button");

    expect(button).toBeInTheDocument();
  });

  it("renders the ListPlus icon", () => {
    render(<TriggerButton onClick={mockOnClick} />);

    // Check ListPlus was called
    expect(MockedListPlus).toHaveBeenCalled();

    // Verify icon is rendered
    const icon = screen.getByTestId("list-plus-icon");

    expect(icon).toBeInTheDocument();
  });

  it("calls onClick when button is clicked", () => {
    render(<TriggerButton onClick={mockOnClick} />);

    const button = screen.getByTestId("mock-button");

    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("passes isIconOnly prop to the Button", () => {
    render(<TriggerButton onClick={mockOnClick} />);

    const buttonProps = MockedButton.mock.calls[0][0];

    expect(buttonProps.isIconOnly).toBe(true);
  });

  it("uses success color for the button", () => {
    render(<TriggerButton onClick={mockOnClick} />);

    const buttonProps = MockedButton.mock.calls[0][0];

    expect(buttonProps.color).toBe("success");
  });

  it("uses small size for the button", () => {
    render(<TriggerButton onClick={mockOnClick} />);

    const buttonProps = MockedButton.mock.calls[0][0];

    expect(buttonProps.size).toBe("sm");
  });

  it("uses bordered variant for the button", () => {
    render(<TriggerButton onClick={mockOnClick} />);

    const buttonProps = MockedButton.mock.calls[0][0];

    expect(buttonProps.variant).toBe("bordered");
  });
});
