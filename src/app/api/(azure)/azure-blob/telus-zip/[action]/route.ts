import { Readable } from "stream";

import { NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";

import { progressEmitter } from "@/src/lib/progressEmitter";

// Azure Storage connection details
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const containerName = process.env.AZURE_STORAGE_DJANGO_CONTAINER_NAME || "";
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

export async function POST(request: Request): Promise<Response> {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const zipfileName = formData.get("zipfileName") as string;
  const uuid = formData.get("uuid") as string;

  // Validate required fields
  if (!file || !zipfileName || !uuid) {
    return NextResponse.json(
      {
        message: "One of {file, zipfileName, uuid} is missing",
      },
      { status: 400 },
    );
  }

  const fullBlobName = `telus/pole-candidates/${uuid}/${zipfileName}`;
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

  return NextResponse.json(
    { message: "File uploaded successfully", azurePath: fullBlobName },
    { status: 200 },
  );
}

export async function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function PATCH() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function PUT() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function DELETE() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function OPTIONS() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
