import { Readable } from "stream";

import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";
import sharp from "sharp";

const rootdir = "tower_reports_images";

// Azure Storage connection details
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "";
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

/**
 * Handles POST requests to upload an image to the Azure Storage container.
 *
 * @param {Request} request - The incoming HTTP request.
 * @returns {Response} - The HTTP response indicating the result of the upload.
 */
export async function POST(request: Request): Promise<Response> {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const label = formData.get("label") as string;
  const subdir = formData.get("subdir") as string;

  // Validate required fields
  if (!file || !label || !subdir) {
    return NextResponse.json(
      {
        message: "One of {file, label, subdir} is missing",
      },
      { status: 400 }
    );
  }

  const azureId = uuidv4();
  const blobName = `${rootdir}/${subdir}/${azureId}-${file.name}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Set blob properties and tags
  const properties = {
    blobHTTPHeaders: {
      blobContentType: file.type || "application/octet-stream",
    },
    tags: {
      // label: label.toString(),
      azureId: azureId.toString(),
    },
  };

  // Convert file to buffer and create a readable stream
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Compress the image using sharp
  const compressedBuffer = await sharp(buffer)
    .resize({ width: 1700 }) // Resize to 2000px width
    .jpeg({ quality: 80 }) // Compress to JPEG with 70% quality
    .toBuffer();

  // Create a readable stream from the compressed buffer
  const stream = Readable.from(compressedBuffer);

  // Upload options
  const blockSize = 4 * 1024 * 1024; // 4MB block size
  const uploadOptions = {
    bufferSize: blockSize,
    maxBuffers: 5,
    blobHTTPHeaders: properties.blobHTTPHeaders,
    onProgress: (progress: any) => {
      console.log(`Progress: ${progress.loadedBytes} bytes uploaded`);
    },
  };

  // Upload the file as a stream
  await blockBlobClient.uploadStream(
    stream,
    uploadOptions.bufferSize,
    uploadOptions.maxBuffers,
    uploadOptions
  );

  // Set tags for the uploaded blob
  await blockBlobClient.setTags(properties.tags);

  return NextResponse.json({
    message: "Image uploaded successfully",
    url: blockBlobClient.url,
    azureId: azureId,
  });
}

/**
 * Handles DELETE requests to delete a blob from the Azure Storage container.
 *
 * @param {Request} request - The incoming HTTP request.
 * @returns {Response} - The HTTP response indicating the result of the deletion.
 */
export async function DELETE(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const azureId = url.searchParams.get("azureId");
  const subdir = url.searchParams.get("subdir");

  // Validate required fields
  if (!azureId || !subdir) {
    return NextResponse.json(
      { message: "One of {Azure ID, subdir} is missing" },
      { status: 400 }
    );
  }

  try {
    // List blobs and find the one that starts with the azureId
    const blobs = containerClient.listBlobsFlat({
      prefix: `${rootdir}/${subdir}`,
    });
    let blobName = null;

    for await (const blob of blobs) {
      if (blob.name.startsWith(`${rootdir}/${subdir}/${azureId}`)) {
        blobName = blob.name;
        break;
      }
    }

    if (!blobName) {
      return NextResponse.json({ message: "Blob not found" }, { status: 404 });
    }

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.delete();

    return NextResponse.json({ message: "Blob deleted successfully" });
  } catch (error) {
    console.error("Error deleting blob:", error);

    return NextResponse.json(
      { message: "Failed to delete blob" },
      { status: 500 }
    );
  }
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

export async function OPTIONS() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
