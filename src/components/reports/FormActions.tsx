import React from "react";
import { Button } from "@heroui/react";
import { CircleOff, FileText, Save, SaveAll } from "lucide-react";

import { FormActionsProps } from "@/src/interfaces/reports";

export const FormActions = ({
  isNew,
  onSaveAndContinue,
  onCancel,
  onGeneratePDF,
}: FormActionsProps) => (
  <div className="space-x-4 mt-4 mx-auto">
    <Button isIconOnly color="success" type="submit">
      <SaveAll />
    </Button>
    <Button
      isIconOnly
      color="success"
      variant="bordered"
      onPress={onSaveAndContinue}
    >
      <Save />
    </Button>
    {!isNew && onGeneratePDF && (
      <Button
        isIconOnly
        color="primary"
        variant="bordered"
        onPress={onGeneratePDF}
      >
        <FileText />
      </Button>
    )}
    <Button isIconOnly color="danger" variant="bordered" onPress={onCancel}>
      <CircleOff />
    </Button>
  </div>
);
