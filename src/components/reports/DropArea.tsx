import React, { useState } from "react";
import { Button } from "@heroui/react";

import { DropAreaProps } from "@/src/interfaces/reports";

export const DropArea = ({
  onFilesAdded,
  isDisabled,
  index,
}: DropAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFilesAdded(event.dataTransfer.files);
      event.dataTransfer.clearData();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFilesAdded(event.target.files);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isDisabled && (event.key === "Enter" || event.key === " ")) {
      const fileInput = document.getElementById(`file-input-${index}`);

      if (fileInput) {
        (fileInput as HTMLInputElement).click();
      }
    }
  };

  return (
    <div
      className={`w-full mx-auto border-2 border-dashed rounded-full ${
        isDragging
          ? "border-emerald-700 dark:border-emerald-300"
          : isDisabled
            ? "border-gray-300 dark:border-gray-800 cursor-not-allowed"
            : "border-primary cursor-pointer"
      }`}
      data-testid="drop-area"
      role="presentation"
      tabIndex={0}
      onClick={() => {
        if (!isDisabled) {
          const fileInput = document.getElementById(`file-input-${index}`);

          if (fileInput) {
            (fileInput as HTMLInputElement).click();
          }
        }
      }}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
    >
      <input
        multiple
        className="hidden"
        data-testid={`file-input-${index}`}
        id={`file-input-${index}`}
        type="file"
        onChange={handleFileChange}
      />
      <Button
        className="text-foreground w-full h-10"
        data-testid="drop-button"
        isDisabled={isDisabled}
        radius="full"
        variant="light"
        onPress={() => {
          const fileInput = document.getElementById(`file-input-${index}`);

          if (fileInput) {
            (fileInput as HTMLInputElement).click();
          }
        }}
      >
        Drag & drop a file here, or click to browse
      </Button>
    </div>
  );
};
