import { useState, useRef } from "react";

import { generateSasToken } from "@/actions/chatbot/azure/action";
import { azureDirectUploadWithSas } from "@/src/lib/azureDirectUpload";
import { uploadSourceToChromaStore } from "@/actions/chatbot/chroma/action";
import {
  FileUploadHookResult,
  SourceType,
  UploadOperation,
  UploadResult,
} from "@/src/interfaces/chatbot";

export const useFileUpload = (
  sourceType: Extract<SourceType, "pdf" | "setics">,
): FileUploadHookResult => {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadOperation, setUploadOperation] =
    useState<UploadOperation>("add");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
      setUploadError(null);
      setUploadResult(null);
    }
  };

  const handleFileUpload = async (operation: UploadOperation) => {
    if (!fileToUpload) {
      setUploadError(
        `Please select a ${sourceType === "pdf" ? "PDF" : "JSON"} file first`,
      );

      return;
    }

    setUploading(true);
    setUploadOperation(operation);
    setUploadError(null);
    setUploadProgress(0);
    setUploadResult(null);

    try {
      // Step 1: Generate SAS token for the file
      const sasResponse = await generateSasToken(fileToUpload.name);

      // Step 2: Upload directly to Azure using the SAS token
      const blobName = await azureDirectUploadWithSas(
        fileToUpload,
        sasResponse,
        (progress) => setUploadProgress(progress),
      );

      // Step 3: Process the uploaded file in the vector store
      const data = await uploadSourceToChromaStore(operation, sourceType, {
        blob_name: blobName,
      });

      // Store the upload result
      setUploadResult(data);

      // Reset file input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setFileToUpload(null);
      setUploadProgress(0);
    } catch (error: any) {
      console.error(`Error during ${sourceType} upload:`, error);
      setUploadError(
        `Failed to ${operation} ${sourceType === "pdf" ? "PDF" : "Setics"} document: ${error.message}`,
      );
    } finally {
      setUploading(false);
    }
  };

  return {
    fileToUpload,
    uploading,
    uploadError,
    uploadOperation,
    uploadProgress,
    uploadResult,
    inputRef,
    handleFileChange,
    handleFileUpload,
  };
};
