import { renderHook, act } from "@testing-library/react";

import { useChecklistForm } from "@/hooks/useChecklistForm";
import { ChecklistRow } from "@/interfaces/reports";

describe("useChecklistForm", () => {
  const mockForms = ["form4", "form5"];
  const mockChecklistRows: ChecklistRow[] = [
    {
      id: "1",
      code: "TEST-01",
      isChecked: true,
      comments: "Test comment 1",
    },
    {
      id: "2",
      code: "TEST-02",
      isChecked: false,
      comments: "Test comment 2",
    },
  ];

  const mockListForm = [{ code: "TEST-01" }, { code: "TEST-02" }];

  it("should initialize with empty arrays for specified forms", () => {
    const { result } = renderHook(() => useChecklistForm(mockForms));

    expect(result.current.checklists).toEqual({
      form4: [],
      form5: [],
    });
  });

  it("should initialize with default forms when no forms are provided", () => {
    const { result } = renderHook(() => useChecklistForm());
    const defaultForms = [
      "form4",
      "form5",
      "form6",
      "form7",
      "form8",
      "form9",
      "form10",
      "form11",
    ];

    defaultForms.forEach((form) => {
      expect(result.current.checklists[form]).toEqual([]);
    });
  });

  it("should initialize form with existing report data", () => {
    const { result } = renderHook(() => useChecklistForm(mockForms));

    act(() => {
      result.current.initializeForm(mockChecklistRows, [], "form4");
    });

    expect(result.current.checklists.form4).toEqual(mockChecklistRows);
  });

  it("should initialize form with new checklist items when no report data exists", () => {
    const { result } = renderHook(() => useChecklistForm(mockForms));

    act(() => {
      result.current.initializeForm(undefined, mockListForm, "form4");
    });

    expect(result.current.checklists.form4).toEqual([
      {
        id: "",
        code: "TEST-01",
        isChecked: undefined,
        comments: "",
      },
      {
        id: "",
        code: "TEST-02",
        isChecked: undefined,
        comments: "",
      },
    ]);
  });

  it("should update form with new checklist data", () => {
    const { result } = renderHook(() => useChecklistForm(mockForms));

    act(() => {
      result.current.updateForm("form4", mockChecklistRows);
    });

    expect(result.current.checklists.form4).toEqual(mockChecklistRows);
  });

  it("should update form using update function", () => {
    const { result } = renderHook(() => useChecklistForm(mockForms));

    act(() => {
      result.current.updateForm("form4", (prev) => [
        ...prev,
        {
          id: "3",
          code: "TEST-03",
          isChecked: true,
          comments: "New item",
        },
      ]);
    });

    expect(result.current.checklists.form4.length).toBe(1);
    expect(result.current.checklists.form4[0].code).toBe("TEST-03");
  });

  it("should handle form field changes correctly", () => {
    const { result } = renderHook(() => useChecklistForm(mockForms));

    act(() => {
      result.current.initializeForm(mockChecklistRows, [], "form4");
      result.current.handleFormChange(
        "form4",
        0,
        "comments",
        "Updated comment",
      );
    });

    expect(result.current.checklists.form4[0].comments).toBe("Updated comment");
  });

  it("should handle boolean field changes", () => {
    const { result } = renderHook(() => useChecklistForm(mockForms));

    act(() => {
      result.current.initializeForm(mockChecklistRows, [], "form4");
      result.current.handleFormChange("form4", 0, "isChecked", false);
    });

    expect(result.current.checklists.form4[0].isChecked).toBe(false);
  });

  it("should maintain other forms when updating one form", () => {
    const { result } = renderHook(() => useChecklistForm(mockForms));

    act(() => {
      result.current.initializeForm(mockChecklistRows, [], "form4");
      result.current.initializeForm(mockChecklistRows, [], "form5");
      result.current.handleFormChange(
        "form4",
        0,
        "comments",
        "Updated comment",
      );
    });

    expect(result.current.checklists.form5).toEqual(mockChecklistRows);
  });
});
