import { useState, useCallback } from "react";

import { ChecklistRow } from "@/interfaces/reports";

type ChecklistState = Record<string, ChecklistRow[]>;

export const useChecklistForm = (
  initialForms: string[] = [
    "form4",
    "form5",
    "form6",
    "form7",
    "form8",
    "form9",
    "form10",
    "form11",
  ],
) => {
  const [checklists, setChecklists] = useState<ChecklistState>(
    initialForms.reduce((acc, formKey) => ({ ...acc, [formKey]: [] }), {}),
  );

  const initializeForm = useCallback(
    (
      reportForm: ChecklistRow[] | undefined,
      listForm: { code: string }[],
      formKey: string,
    ) => {
      if (reportForm && reportForm.length > 0) {
        setChecklists((prev) => ({ ...prev, [formKey]: reportForm }));
      } else {
        const initialForm = listForm.map((listItem) => ({
          id: "",
          code: listItem.code,
          isChecked: undefined,
          comments: "",
        }));

        setChecklists((prev) => ({ ...prev, [formKey]: initialForm }));
      }
    },
    [],
  );

  const updateForm = useCallback(
    (
      formKey: string,
      newForm: ChecklistRow[] | ((prev: ChecklistRow[]) => ChecklistRow[]),
    ) => {
      setChecklists((prev) => ({
        ...prev,
        [formKey]:
          typeof newForm === "function" ? newForm(prev[formKey]) : newForm,
      }));
    },
    [],
  );

  const handleFormChange = useCallback(
    (
      formKey: string,
      index: number,
      field: string,
      value: string | boolean | undefined,
    ) => {
      setChecklists((prev) => {
        const updatedForm = [...prev[formKey]];

        updatedForm[index] = { ...updatedForm[index], [field]: value };

        return { ...prev, [formKey]: updatedForm };
      });
    },
    [],
  );

  return {
    checklists,
    initializeForm,
    updateForm,
    handleFormChange,
  };
};
