"use client";

import { Button, Spinner } from "@heroui/react";
import { PlusCircle, RefreshCw } from "lucide-react";

import { UploadActionButtonsProps } from "@/interfaces/chatbot";

export const UploadActionButtons = ({
  uploading,
  disabled,
  currentOperation,
  onUpload,
}: UploadActionButtonsProps) => (
  <div className="flex gap-2 w-full">
    <Button
      className="flex-1"
      color="primary"
      disabled={uploading || disabled}
      startContent={<PlusCircle size={16} />}
      onPress={() => onUpload("add")}
    >
      {uploading && currentOperation === "add" ? (
        <Spinner size="sm" />
      ) : (
        "Add New"
      )}
    </Button>
    <Button
      className="flex-1"
      color="primary"
      disabled={uploading || disabled}
      startContent={<RefreshCw size={16} />}
      variant="bordered"
      onPress={() => onUpload("update")}
    >
      {uploading && currentOperation === "update" ? (
        <Spinner size="sm" />
      ) : (
        "Update Existing"
      )}
    </Button>
  </div>
);
