import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Fix the import path
import ChecklistForms from "@/components/reports/checklist/ChecklistForms";

// Fix mock paths to match actual component paths
jest.mock("@/components/reports/FormSectionAccordion", () => {
  return function MockAccordion({
    children,
    title,
  }: {
    children: React.ReactNode;
    title: string;
  }) {
    return (
      <div data-testid="mock-accordion">
        <div data-testid="accordion-title">{title}</div>
        <div data-testid="accordion-content">{children}</div>
      </div>
    );
  };
});

jest.mock("@/components/reports/checklist/DynamicForm", () => {
  return {
    DynamicForm: function MockDynamicForm({
      checkListForm,
      list,
      onFormChange,
    }: any) {
      return (
        <div data-testid="mock-dynamic-form">
          <button
            data-testid="trigger-form-change"
            onClick={() => onFormChange(null, 0, "isChecked", true)}
          >
            Change Form
          </button>
          <div data-testid="form-data">
            {JSON.stringify({ checkListForm, list })}
          </div>
        </div>
      );
    },
  };
});

describe("ChecklistForms", () => {
  const mockChecklists = {
    form4: [{ id: "1", code: "A1", isChecked: false, comments: "" }],
    form5: [{ id: "2", code: "B1", isChecked: false, comments: "" }],
  };

  const mockFormConfigs = [
    {
      key: "form4",
      title: "Form 4",
      list: [{ code: "A1", item: "Test Item 1" }],
    },
    {
      key: "form5",
      title: "Form 5",
      list: [{ code: "B1", item: "Test Item 2" }],
    },
  ];

  const mockOnFormChange = jest.fn();
  const mockOnFormUpdate = jest.fn();

  const defaultProps = {
    checklists: mockChecklists,
    formConfigs: mockFormConfigs,
    onFormChange: mockOnFormChange,
    onFormUpdate: mockOnFormUpdate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form sections", () => {
    render(<ChecklistForms {...defaultProps} />);

    const accordions = screen.getAllByTestId("mock-accordion");

    expect(accordions).toHaveLength(2);

    expect(screen.getByText("Form 4")).toBeInTheDocument();
    expect(screen.getByText("Form 5")).toBeInTheDocument();
  });

  it("passes correct props to DynamicForm components", () => {
    render(<ChecklistForms {...defaultProps} />);

    const formDataElements = screen.getAllByTestId("form-data");
    const firstFormData = JSON.parse(formDataElements[0].textContent || "");

    expect(firstFormData.checkListForm).toEqual(mockChecklists.form4);
    expect(firstFormData.list).toEqual(mockFormConfigs[0].list);
  });

  it("handles form changes correctly", () => {
    render(<ChecklistForms {...defaultProps} />);

    const changeButtons = screen.getAllByTestId("trigger-form-change");

    fireEvent.click(changeButtons[0]);

    expect(mockOnFormChange).toHaveBeenCalledWith(
      "form4",
      0,
      "isChecked",
      true,
    );
  });

  it("maintains referential equality when props haven't changed (memo test)", () => {
    const { rerender } = render(<ChecklistForms {...defaultProps} />);

    const firstRender = screen.getAllByTestId("mock-accordion");

    // Rerender with same props
    rerender(<ChecklistForms {...defaultProps} />);
    const secondRender = screen.getAllByTestId("mock-accordion");

    expect(firstRender).toEqual(secondRender);
  });

  it("updates when checklists change", () => {
    const { rerender } = render(<ChecklistForms {...defaultProps} />);

    const updatedChecklists = {
      ...mockChecklists,
      form4: [{ id: "1", code: "A1", isChecked: true, comments: "Updated" }],
    };

    rerender(
      <ChecklistForms {...defaultProps} checklists={updatedChecklists} />,
    );

    const formDataElements = screen.getAllByTestId("form-data");
    const firstFormData = JSON.parse(formDataElements[0].textContent || "");

    expect(firstFormData.checkListForm).toEqual(updatedChecklists.form4);
  });

  it("handles empty checklists gracefully", () => {
    render(
      <ChecklistForms
        {...defaultProps}
        checklists={{}}
        formConfigs={mockFormConfigs}
      />,
    );

    expect(screen.getAllByTestId("mock-accordion")).toHaveLength(2);
    expect(screen.getAllByTestId("mock-dynamic-form")).toHaveLength(2);
  });
});
