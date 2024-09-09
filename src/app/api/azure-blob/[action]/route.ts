import { Readable } from "stream";

import { NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";

import { progressEmitter } from "@/src/lib/progressEmitter";

// Azure Storage connection details
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "";
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || "";
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

/**
 * Handles GET requests to list blobs in the Azure Storage container.
 *
 * @param {Request} request - The incoming HTTP request.
 * @returns {Response} - The HTTP response with the list of blobs.
 */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const subdir = url.searchParams.get("subdir") || "";

  const blobs = [];

  // List blobs in the specified subdirectory
  for await (const blob of containerClient.listBlobsFlat({ prefix: subdir })) {
    const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
    const tags = await blockBlobClient.getTags();
    const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blob.name}`;

    blobs.push({
      name: blob.name,
      createdOn: blob.properties.createdOn,
      contentType: blob.properties.contentType,
      tags: tags.tags,
      url: blobUrl, // Add the URL property
    });
  }

  return NextResponse.json(blobs);
}

/**
 * Handles POST requests to upload a file to the Azure Storage container.
 *
 * @param {Request} request - The incoming HTTP request.
 * @returns {Response} - The HTTP response indicating the result of the upload.
 */
export async function POST(request: Request): Promise<Response> {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const blobName = formData.get("blobName") as string;
  const subdir = (formData.get("subdir") as string) || "";
  const categoryName = formData.get("categoryName") as string;
  const clientName = formData.get("clientName") as string;
  const uuid = formData.get("uuid") as string;

  // Validate required fields
  if (!file || !blobName || !categoryName || !clientName || !uuid) {
    return NextResponse.json(
      {
        message:
          "One of {file, blob name, project name, client name, UUID} is missing",
      },
      { status: 400 },
    );
  }

  const fullBlobName = `${subdir}/${blobName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(fullBlobName);

  // Set blob properties and tags
  const properties = {
    blobHTTPHeaders: {
      blobContentType: file.type || "application/octet-stream",
      blobContentEncoding: "",
      blobContentLanguage: "",
      blobContentDisposition: "",
      blobCacheControl: "",
    },
    tags: {
      categoryName: categoryName.toString(),
      clientName: clientName.toString(),
      uuid: uuid.toString(),
    },
  };

  // Convert file to buffer and create a readable stream
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const stream = Readable.from(buffer);

  // Upload options
  const blockSize = 4 * 1024 * 1024; // 4MB block size
  const uploadOptions = {
    bufferSize: blockSize,
    maxBuffers: 5,
    blobHTTPHeaders: properties.blobHTTPHeaders,
    onProgress: (progress: any) => {
      console.log(`Progress: ${progress.loadedBytes} bytes uploaded`);
      // Emit progress event
      progressEmitter.emit("progress", {
        uuid,
        loadedBytes: progress.loadedBytes,
      });
    },
  };

  // Upload the file as a stream
  await blockBlobClient.uploadStream(
    stream,
    uploadOptions.bufferSize,
    uploadOptions.maxBuffers,
    uploadOptions,
  );

  // Set tags for the uploaded blob
  await blockBlobClient.setTags(properties.tags);

  return NextResponse.json({ message: "File uploaded successfully" });
}

/**
 * Handles DELETE requests to delete a blob from the Azure Storage container.
 *
 * @param {Request} request - The incoming HTTP request.
 * @returns {Response} - The HTTP response indicating the result of the deletion.
 */
export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const blobName = url.searchParams.get("blobName");

  // Validate required fields
  if (!blobName) {
    return NextResponse.json(
      { message: "Blob name is missing" },
      { status: 400 },
    );
  }

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    await blockBlobClient.delete();

    return NextResponse.json({ message: "Blob deleted successfully" });
  } catch (error) {
    console.error("Error deleting blob:", error);

    return NextResponse.json(
      { message: "Failed to delete blob" },
      { status: 500 },
    );
  }
}
