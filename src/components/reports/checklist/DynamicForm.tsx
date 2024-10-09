import React from "react";
import { RadioGroup, Radio } from "@nextui-org/react";

import { ChecklistRow } from "@/types/reports";

export interface ListItem {
  code: string;
  item: string;
}

interface DynamicFormProps {
  checkListForm: ChecklistRow[];
  list: ListItem[];
  onFormChange: (
    index: number,
    field: string,
    value: string | boolean | undefined,
  ) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  checkListForm,
  list,
  onFormChange,
}) => {
  const handleInputChange = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    let parsedValue: string | boolean | undefined;

    if (field === "isChecked") {
      parsedValue = value === "yes" ? true : value === "no" ? false : undefined;
    } else {
      parsedValue = value;
    }
    onFormChange(index, field, parsedValue);
  };

  return (
    <div>
      {list.map((listItem, index) => {
        // Find the correct index in checkListForm that matches the listItem.code
        const checkListIndex = checkListForm.findIndex(
          (item) => item.code === listItem.code,
        );
        // If no matching code is found, use the current index
        const currentIndex = checkListIndex !== -1 ? checkListIndex : index;
        const radioStatus =
          checkListForm[currentIndex]?.isChecked === true
            ? "yes"
            : checkListForm[currentIndex]?.isChecked === false
              ? "no"
              : "na";

        return (
          <div
            key={index}
            className="grid grid-cols-[auto_1fr_auto_1fr] w-full space-y-2 space-x-2"
          >
            {/* Items code */}
            <div className="border-2 h-10 w-20 border-primary text-foreground/50 rounded-3xl text-nowrap flex items-center justify-center">
              <p className="text-ellipsis overflow-hidden text-center">
                {checkListForm[currentIndex]?.code || ""}
              </p>
            </div>
            {/* Items description */}
            <div className="flex items-center justify-start">
              <p className="text-xs text-start">{listItem.item}</p>
            </div>
            {/* Checklist buttons */}
            <RadioGroup
              color="primary"
              orientation="horizontal"
              value={radioStatus}
              onValueChange={(value) =>
                handleInputChange(currentIndex, "isChecked", value)
              }
            >
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
              <Radio value="na">N/A</Radio>
            </RadioGroup>
            {/* Comments */}
            <input
              className="border-2 h-10 border-primary bg-background text-foreground rounded-3xl text-nowrap flex items-center text-start"
              placeholder="Comments"
              type="text"
              value={checkListForm[currentIndex]?.comments || ""}
              onChange={(e) =>
                handleInputChange(currentIndex, "comments", e.target.value)
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default DynamicForm;
