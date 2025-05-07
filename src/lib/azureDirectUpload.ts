import { SasTokenResponse } from "@/interfaces/chatbot";

export async function azureDirectUploadWithSas(
  file: File,
  sasResponse: SasTokenResponse,
  onProgress?: (progress: number) => void,
): Promise<string> {
  if (!sasResponse.success) {
    throw new Error(sasResponse.errorMessage || "Failed to get SAS token");
  }

  const { sasToken, containerName, blobName, accountName } = sasResponse;

  // Construct the URL for the blob
  const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
  const blobUrlWithSas = `${blobUrl}?${sasToken}`;

  // Create headers
  const headers = new Headers();

  headers.append("x-ms-blob-type", "BlockBlob");
  headers.append("Content-Type", file.type || "application/octet-stream");

  try {
    // Use XMLHttpRequest to track upload progress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = (event.loaded / event.total) * 100;

          onProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Return the blob name to be used in the Chroma store
          resolve(blobName);
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Upload failed due to network error"));
      };

      xhr.open("PUT", blobUrlWithSas, true);

      // Set headers
      for (const [key, value] of headers.entries()) {
        xhr.setRequestHeader(key, value);
      }

      // Send the file
      xhr.send(file);
    });
  } catch (error) {
    throw new Error(`Error during upload: ${error}`);
  }
}
