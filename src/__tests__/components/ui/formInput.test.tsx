import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  FormInput,
  NoteInput,
  AntennaFormInput,
  DisplayInput,
  DisplayInputWithTooltip,
  FormSectionTitle,
  LabelInput,
  TrashButton,
  CopyButton,
  AddButton,
} from "@/src/components/ui/formInput";

describe("FormInput Components", () => {
  describe("FormInput", () => {
    const mockOnChange = jest.fn();
    const defaultProps = {
      value: "test value",
      name: "test-input",
      label: "Test Label",
      placeholder: "Enter test...",
      onChange: mockOnChange,
    };

    it("renders with label and input", () => {
      render(<FormInput {...defaultProps} />);

      expect(screen.getByText("Test Label")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveValue("test value");
    });

    it("handles input changes", async () => {
      render(<FormInput {...defaultProps} />);

      const input = screen.getByRole("textbox");

      await userEvent.type(input, "new value");

      expect(mockOnChange).toHaveBeenCalled();
    });

    it("renders with tooltip when withTooltip is true", () => {
      render(<FormInput {...defaultProps} withTooltip />);

      // Use querySelector instead of getByClassName
      const tooltipWrapper = document.querySelector(".relative.inline-block");

      expect(tooltipWrapper).toBeInTheDocument();

      // Test for tooltip content
      const tooltipContent = screen.getByText(defaultProps.value, {
        selector: "div > div",
      });

      expect(tooltipContent).toBeInTheDocument();
    });
  });

  describe("NoteInput", () => {
    const mockOnChange = jest.fn();

    it("renders with correct placeholder", () => {
      render(<NoteInput id="note" value="" onChange={mockOnChange} />);

      expect(screen.getByPlaceholderText("...")).toBeInTheDocument();
    });
  });

  describe("AntennaFormInput", () => {
    const mockOnChange = jest.fn();
    const props = {
      value: "antenna",
      name: "antenna-input",
      width: "w-full",
      placeholder: "Enter antenna...",
      onChange: mockOnChange,
    };

    it("renders with correct width class", () => {
      render(<AntennaFormInput {...props} />);

      const input = screen.getByRole("textbox");

      expect(input.parentElement).toHaveClass("w-full");
    });
  });

  describe("DisplayInput", () => {
    it("renders value correctly", () => {
      render(<DisplayInput value="display text" />);
      expect(screen.getByText("display text")).toBeInTheDocument();
    });

    it("applies custom width class", () => {
      render(<DisplayInput value="text" width="w-full" />);
      expect(screen.getByText("text").parentElement).toHaveClass("w-full");
    });
  });

  describe("DisplayInputWithTooltip", () => {
    it("renders with tooltip", () => {
      render(<DisplayInputWithTooltip value="tooltip text" />);
      const tooltipTexts = screen.getAllByText("tooltip text");

      expect(tooltipTexts).toHaveLength(2);
      expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    });
  });

  describe("FormSectionTitle", () => {
    it("renders title with correct styling", () => {
      render(<FormSectionTitle title="Section Title" />);
      const title = screen.getByText("Section Title");

      expect(title).toHaveClass("uppercase");
    });
  });

  describe("LabelInput", () => {
    const mockOnChange = jest.fn();
    const props = {
      value: "label",
      name: "label-input",
      placeholder: "Enter label...",
      options: ["option1", "option2"],
      onChange: mockOnChange,
    };

    it("renders with datalist options", () => {
      render(<LabelInput {...props} />);

      const datalist = screen.getByRole("combobox");

      expect(datalist).toBeInTheDocument();
    });
  });

  describe("Action Buttons", () => {
    const mockOnClick = jest.fn();

    it("renders TrashButton with correct color", () => {
      render(<TrashButton onPress={mockOnClick} />);
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("data-color", "danger");
    });

    it("renders CopyButton with correct color", () => {
      render(<CopyButton onPress={mockOnClick} />);
      const button = screen.getByRole("button");

      expect(button).toHaveAttribute("data-color", "primary");
    });

    it("renders AddButton with label", () => {
      render(<AddButton label="Add Item" onPress={mockOnClick} />);
      expect(screen.getByText("Add Item")).toBeInTheDocument();
    });
  });
});
