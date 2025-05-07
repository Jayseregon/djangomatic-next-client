"use client";

import { Input, Progress } from "@heroui/react";

import { FileUploadInputProps } from "@/interfaces/chatbot";

export const FileUploadInput = ({
  accept,
  icon,
  inputRef,
  handleFileChange,
  fileToUpload,
  uploadProgress,
  uploading,
}: FileUploadInputProps) => (
  <>
    <Input
      ref={inputRef}
      accept={accept}
      classNames={{
        inputWrapper: "bg-background border border-foreground",
      }}
      color="default"
      startContent={icon}
      type="file"
      onChange={handleFileChange}
    />
    {fileToUpload && (
      <p className="text-sm text-foreground font-light font-mono">
        Selected: {fileToUpload.name}
      </p>
    )}

    {uploading && uploadProgress > 0 && (
      <Progress
        aria-label="Upload progress"
        className="w-full"
        color="primary"
        value={uploadProgress}
      />
    )}
  </>
);
