import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { DropAreaProps } from "@/src/interfaces/reports";
import { AddImageIcon } from "../icons";

export const DropArea = ({
  onFilesAdded,
  newImageButtonName,
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

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full mx-auto border-2 border-dashed rounded-full ${
        isDragging
          ? "border-emerald-700 dark:border-emerald-300"
          : isDisabled
            ? "border-gray-300 dark:border-gray-800"
            : "border-primary cursor-pointer"
      }`}
      onClick={() => {
        if (!isDisabled) {
          const fileInput = document.getElementById(`file-input-${index}`);
          if (fileInput) {
            (fileInput as HTMLInputElement).click();
          }
        }
      }}>
      <input
        id={`file-input-${index}`}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        className="text-foreground w-full h-10"
        radius="full"
        variant="light"
        isDisabled={isDisabled}
        onClick={(e) => {
          e.stopPropagation(); // Prevent the click event from bubbling up to the div
          const fileInput = document.getElementById(`file-input-${index}`);
          if (fileInput) {
            (fileInput as HTMLInputElement).click();
          }
        }}>
        Drag & drop a file here, or click to browse
      </Button>
    </div>
  );
};
