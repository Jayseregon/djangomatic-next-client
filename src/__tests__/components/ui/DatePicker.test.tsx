import { render, screen, fireEvent } from "@testing-library/react";
import { format } from "date-fns";

import { DatePicker } from "@/components/ui/DatePicker";

// Mock HeroUI components
jest.mock("@heroui/react", () => ({
  Popover: ({ children }: { children: React.ReactNode }) => (
    <div role="dialog">{children}</div>
  ),
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Button: ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react Calendar icon
jest.mock("lucide-react", () => ({
  Calendar: () => <span data-testid="calendar-icon" />,
}));

describe("DatePicker", () => {
  const defaultProps = {
    onChange: jest.fn(),
    label: "Test Date",
    placeholder: "Select date",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with label", () => {
      render(<DatePicker {...defaultProps} />);
      expect(screen.getByText("Test Date")).toBeInTheDocument();
    });

    it("renders placeholder when no date is selected", () => {
      render(<DatePicker {...defaultProps} />);
      expect(screen.getByText("Select date")).toBeInTheDocument();
    });

    it("renders formatted date when value is provided", () => {
      // Set the date to noon to avoid timezone issues
      const testDate = new Date("2024-01-15T12:00:00Z");

      render(<DatePicker {...defaultProps} value={testDate} />);
      const button = screen.getByRole("button");
      const expectedDate = format(
        new Date(testDate.getTime() + testDate.getTimezoneOffset() * 60000),
        "yyyy-MM-dd",
      );

      expect(button).toHaveTextContent(expectedDate);
    });

    it("handles undefined value", () => {
      render(<DatePicker {...defaultProps} value={undefined} />);
      expect(screen.getByText("Select date")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("opens popover when button is clicked", () => {
      render(<DatePicker {...defaultProps} />);
      const button = screen.getByRole("button");

      fireEvent.click(button);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("calls onChange when date is selected", () => {
      render(<DatePicker {...defaultProps} />);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      const dateInput =
        screen.getByRole("textbox", { hidden: true }) ||
        screen.getByDisplayValue("");

      fireEvent.change(dateInput, { target: { value: "2024-01-15" } });

      expect(defaultProps.onChange).toHaveBeenCalled();
      const calledDate = defaultProps.onChange.mock.calls[0][0];

      expect(format(calledDate, "yyyy-MM-dd")).toBe("2024-01-15");
    });

    it("handles null when date is cleared", () => {
      const testDate = new Date("2024-01-15T12:00:00Z");

      render(<DatePicker {...defaultProps} value={testDate} />);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      const dateInput = screen.getByRole("textbox");
      // Use a change event with a proper target value
      const changeEvent = {
        target: {
          value: "",
          type: "date",
        },
      };

      fireEvent.change(dateInput, changeEvent);

      expect(defaultProps.onChange).toHaveBeenCalledWith(null);
    });
  });

  describe("Date Handling", () => {
    it("correctly formats input date value", () => {
      const testDate = new Date("2024-01-15T12:00:00Z");

      render(<DatePicker {...defaultProps} value={testDate} />);

      const button = screen.getByRole("button");

      fireEvent.click(button);

      const dateInput = screen.getByDisplayValue("2024-01-15");

      expect(dateInput).toBeInTheDocument();
    });

    it("handles timezone correctly", () => {
      const testDate = new Date("2024-01-15T12:00:00Z");

      render(<DatePicker {...defaultProps} value={testDate} />);

      const button = screen.getByRole("button");

      fireEvent.click(button);

      const dateInput = screen.getByRole("textbox");
      // Adjust the expected date to match the component's timezone handling
      const expectedDate = format(
        new Date(testDate.getTime() + testDate.getTimezoneOffset() * 60000),
        "yyyy-MM-dd",
      );

      expect(dateInput).toHaveValue(expectedDate);
    });
  });

  describe("Accessibility", () => {
    it("has accessible button with calendar label", () => {
      render(<DatePicker {...defaultProps} />);
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("aria-label", "Select date");
    });

    it("has accessible date input", () => {
      render(<DatePicker {...defaultProps} />);
      const button = screen.getByRole("button");

      fireEvent.click(button);

      const dateInput =
        screen.getByDisplayValue("") ||
        screen.getByRole("textbox", { hidden: true });

      expect(dateInput).toBeInTheDocument();
      expect(dateInput).toHaveAttribute("type", "date");
    });
  });

  describe("Styling", () => {
    it("applies custom className", () => {
      render(<DatePicker {...defaultProps} className="custom-class" />);
      const container = screen.getByTestId("datepicker-container");

      expect(container).toHaveClass("custom-class");
    });

    it("applies correct button styling", () => {
      render(<DatePicker {...defaultProps} />);
      const button = screen.getByRole("button");

      expect(button).toHaveClass("w-full", "justify-start", "gap-2");
    });
  });
});
