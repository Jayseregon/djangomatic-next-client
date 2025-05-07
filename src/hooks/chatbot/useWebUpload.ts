import { useState } from "react";

import { uploadSourceToChromaStore } from "@/actions/chatbot/chroma/action";
import {
  UploadOperation,
  UploadResult,
  WebUploadHookResult,
} from "@/src/interfaces/chatbot";

export const useWebUpload = (): WebUploadHookResult => {
  const [urlToProcess, setUrlToProcess] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [operation, setOperation] = useState<UploadOperation>("add");
  const [withImages, setWithImages] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult>(null);

  const handleUrlSubmit = async (operation: UploadOperation) => {
    if (!urlToProcess.trim()) {
      setError("Please enter a URL");

      return;
    }

    setProcessing(true);
    setOperation(operation);
    setError(null);
    setUploadResult(null);

    try {
      // Process the URL with the vector store
      const data = await uploadSourceToChromaStore(operation, "web", {
        web_url: urlToProcess,
        with_images: withImages,
      });

      // Store the upload result
      setUploadResult(data);

      // Clear the input
      setUrlToProcess("");
    } catch (err: any) {
      setError(`Failed to ${operation} URL: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return {
    urlToProcess,
    processing,
    error,
    operation,
    withImages,
    uploadResult,
    setUrlToProcess,
    setWithImages,
    handleUrlSubmit,
  };
};
