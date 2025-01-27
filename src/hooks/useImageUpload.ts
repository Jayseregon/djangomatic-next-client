import { useCallback } from "react";

export function useImageUpload() {
  const uploadImageToAzure = useCallback(
    async (file: File, label: string, subdir: string) => {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("label", label);
      formData.append("subdir", subdir);

      const response = await fetch("/api/azure-report-images/upload", {
        method: "POST",
        body: formData,
      });

      return await response.json();
    },
    [],
  );

  return { uploadImageToAzure };
}
