import React, { memo } from "react";

import { ChecklistRow } from "@/interfaces/reports";

import FormSectionAccordion from "../FormSectionAccordion";

import { DynamicForm } from "./DynamicForm";

interface FormConfig {
  key: string;
  title: string;
  list: { code: string; item: string }[];
}

interface ChecklistFormsProps {
  checklists: Record<string, ChecklistRow[]>;
  formConfigs: FormConfig[];
  onFormChange: (
    formKey: string,
    index: number,
    field: string,
    value: any,
  ) => void;
  onFormUpdate: (
    formKey: string,
    newForm: ChecklistRow[] | ((prev: ChecklistRow[]) => ChecklistRow[]),
  ) => void;
}

export const ChecklistForms = memo(
  ({
    checklists,
    formConfigs,
    onFormChange,
    onFormUpdate,
  }: ChecklistFormsProps) => (
    <>
      {formConfigs.map(({ key, title, list }) => (
        <FormSectionAccordion key={key} menuKey={key} title={title}>
          <DynamicForm
            checkListForm={checklists[key]}
            list={list}
            setChecklistForm={(formOrUpdater) =>
              onFormUpdate(key, formOrUpdater)
            }
            onFormChange={(_, index, field, value) =>
              onFormChange(key, index, field, value)
            }
          />
        </FormSectionAccordion>
      ))}
    </>
  ),
);

ChecklistForms.displayName = "ChecklistForms";
