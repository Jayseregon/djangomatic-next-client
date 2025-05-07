"use server";

import {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";

import { SasTokenResponse } from "@/interfaces/chatbot";

const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "";
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || "";
const accountKey = process.env.AZURE_ACCOUNT_KEY || "";

export async function generateSasToken(
  fileName: string,
): Promise<SasTokenResponse> {
  try {
    if (!accountName || !accountKey || !containerName) {
      throw new Error("Azure Storage configuration is missing");
    }

    // Define the container name for the chatbot
    const chatbotContainer = `${containerName}/chatbot`;

    // Create a unique blob name with timestamp and original filename
    const timestamp = new Date().toISOString().replace(/[^a-zA-Z0-9]/g, "");
    const blobName = `${timestamp}/${fileName}`;

    console.log("Blob Name:", blobName);

    // Create the SAS token
    const sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey,
    );

    // Set the expiry time for the SAS token (15 minutes)
    const expiryTime = new Date();

    expiryTime.setMinutes(expiryTime.getMinutes() + 5);

    // Set permissions for the SAS token
    const sasOptions = {
      containerName: chatbotContainer,
      blobName,
      permissions: BlobSASPermissions.from({ write: true, create: true }),
      startsOn: new Date(),
      expiresOn: expiryTime,
    };

    // Generate the SAS token
    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential,
    ).toString();

    console.log("SAS Token:", sasToken);

    return {
      success: true,
      sasToken,
      containerName: chatbotContainer,
      blobName,
      accountName,
    };
  } catch (error) {
    console.error("Error generating SAS token:", error);

    return {
      success: false,
      sasToken: "",
      containerName: "",
      blobName: "",
      accountName: "",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
