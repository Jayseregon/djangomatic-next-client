import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import "@testing-library/jest-dom";
import { DynamicForm } from "@/components/reports/checklist/DynamicForm";

// Mock @heroui/react Radio components
jest.mock("@heroui/react", () => ({
  RadioGroup: ({ children, onValueChange, value }: any) => (
    <div data-testid="radio-group" data-value={value}>
      <div
        aria-checked={value === "yes"}
        data-testid="radio-yes"
        role="radio"
        tabIndex={0}
        onClick={() => onValueChange("yes")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onValueChange("yes");
          }
        }}
      >
        Yes
      </div>
      <div
        aria-checked={value === "no"}
        data-testid="radio-no"
        role="radio"
        tabIndex={0}
        onClick={() => onValueChange("no")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onValueChange("no");
          }
        }}
      >
        No
      </div>
      <div
        aria-checked={value === "na"}
        data-testid="radio-na"
        role="radio"
        tabIndex={0}
        onClick={() => onValueChange("na")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onValueChange("na");
          }
        }}
      >
        N/A
      </div>
      {children}
    </div>
  ),
  Radio: ({ value, children }: any) => (
    <div data-testid={`radio-option-${value}`}>{children}</div>
  ),
}));

describe("DynamicForm", () => {
  const mockList = [
    { code: "A1", item: "Test Item 1" },
    { code: "A2", item: "Test Item 2" },
  ];

  const mockCheckListForm = [
    { id: "1", code: "A1", isChecked: false, comments: "" },
    { id: "2", code: "A2", isChecked: true, comments: "Test comment" },
  ];

  const defaultProps = {
    setChecklistForm: jest.fn(),
    checkListForm: mockCheckListForm,
    list: mockList,
    onFormChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all list items with their corresponding codes", () => {
    render(<DynamicForm {...defaultProps} />);

    mockList.forEach((item) => {
      expect(screen.getByText(item.code)).toBeInTheDocument();
      expect(screen.getByText(item.item)).toBeInTheDocument();
    });
  });

  it("displays correct radio button states based on isChecked value", () => {
    render(<DynamicForm {...defaultProps} />);

    const radioGroups = screen.getAllByTestId("radio-group");

    expect(radioGroups[0]).toHaveAttribute("data-value", "no"); // First item isChecked: false
    expect(radioGroups[1]).toHaveAttribute("data-value", "yes"); // Second item isChecked: true
  });

  it("handles radio button changes correctly", () => {
    render(<DynamicForm {...defaultProps} />);

    const radioYes = screen.getAllByTestId("radio-yes")[0];

    fireEvent.click(radioYes);

    expect(defaultProps.onFormChange).toHaveBeenCalledWith(
      defaultProps.setChecklistForm,
      0,
      "isChecked",
      true,
    );
  });

  it("displays and handles comments input correctly", () => {
    render(<DynamicForm {...defaultProps} />);

    const commentInputs = screen.getAllByPlaceholderText("Comments");

    expect(commentInputs[1]).toHaveValue("Test comment");

    fireEvent.change(commentInputs[0], { target: { value: "New comment" } });

    expect(defaultProps.onFormChange).toHaveBeenCalledWith(
      defaultProps.setChecklistForm,
      0,
      "comments",
      "New comment",
    );
  });

  it("handles N/A selection correctly", () => {
    render(<DynamicForm {...defaultProps} />);

    const radioNA = screen.getAllByTestId("radio-na")[0];

    fireEvent.click(radioNA);

    expect(defaultProps.onFormChange).toHaveBeenCalledWith(
      defaultProps.setChecklistForm,
      0,
      "isChecked",
      undefined,
    );
  });

  it("matches items by code when form and list orders differ", () => {
    // Reverse the list but keep the form order
    const reorderedList = [...mockList].reverse();

    render(<DynamicForm {...defaultProps} list={reorderedList} />);

    const commentInputs = screen.getAllByPlaceholderText("Comments");

    // Since A2 will now be first in the list, its comment should be in the first input
    expect(commentInputs[0]).toHaveValue("Test comment");
    expect(commentInputs[1]).toHaveValue("");
  });

  it("handles empty or partial checklist forms gracefully", () => {
    render(
      <DynamicForm
        {...defaultProps}
        checkListForm={[
          { id: "1", code: "A1", isChecked: false, comments: "" },
        ]}
      />,
    );

    expect(screen.getAllByTestId("radio-group")).toHaveLength(2);
    expect(screen.getAllByPlaceholderText("Comments")).toHaveLength(2);
  });
});
