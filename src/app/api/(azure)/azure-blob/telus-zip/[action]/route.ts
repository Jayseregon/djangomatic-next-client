import fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";
import os from "os";

import { NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";

import { progressEmitter } from "@/src/lib/progressEmitter";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Azure Storage connection details
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const containerName = process.env.AZURE_STORAGE_DJANGO_CONTAINER_NAME || "";
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

export async function POST(request: Request): Promise<Response> {
  const formData = await request.formData();
  const chunk = formData.get("chunk") as File;
  const chunkIndex = formData.get("chunkIndex") as string;
  const totalChunks = formData.get("totalChunks") as string;
  const zipfileName = formData.get("zipfileName") as string;
  const uuid = formData.get("uuid") as string;

  if (!chunk || !chunkIndex || !totalChunks || !zipfileName || !uuid) {
    return NextResponse.json(
      {
        message:
          "One of {chunk, chunkIndex, totalChunks, zipfileName, uuid} is missing",
      },
      { status: 400 },
    );
  }

  const tempDir = path.join(os.tmpdir(), uuid);

  await fsPromises.mkdir(tempDir, { recursive: true });

  const chunkPath = path.join(tempDir, `chunk_${chunkIndex}`);
  const arrayBuffer = await chunk.arrayBuffer();

  await fsPromises.writeFile(chunkPath, Buffer.from(arrayBuffer));

  const receivedChunks = await fsPromises.readdir(tempDir);

  if (receivedChunks.length === parseInt(totalChunks)) {
    // All chunks received, assemble the file
    const filePath = path.join(tempDir, zipfileName);
    const writeStream = fs.createWriteStream(filePath);

    for (let i = 0; i < parseInt(totalChunks); i++) {
      const chunkFile = path.join(tempDir, `chunk_${i}`);
      const data = await fsPromises.readFile(chunkFile);

      writeStream.write(data);
      await fsPromises.unlink(chunkFile); // Remove chunk file after reading
    }

    writeStream.end();

    return await new Promise<Response>((resolve, reject) => {
      writeStream.on("finish", async () => {
        try {
          // Upload the assembled file to Azure Blob Storage
          const fullBlobName = `telus/pole-candidates/${uuid}/${zipfileName}`;
          const blockBlobClient =
            containerClient.getBlockBlobClient(fullBlobName);

          const uploadStream = fs.createReadStream(filePath);
          const uploadOptions = {
            bufferSize: 5 * 1024 * 1024, // 5MB buffer
            maxConcurrency: 5,
            onProgress: (progress: any) => {
              progressEmitter.emit("progress", {
                uuid,
                bytesUploaded: progress.loadedBytes,
              });
            },
          };

          await blockBlobClient.uploadStream(
            uploadStream,
            uploadOptions.bufferSize,
            uploadOptions.maxConcurrency,
            uploadOptions,
          );
          // Clean up temporary files
          await fsPromises.unlink(filePath);
          await fsPromises.rmdir(tempDir);

          resolve(
            NextResponse.json(
              {
                message: "File uploaded successfully",
                azurePath: fullBlobName,
              },
              { status: 200 },
            ),
          );
        } catch (error) {
          reject(error);
        }
      });

      writeStream.on("error", (error) => {
        reject(error);
      });
    });
  } else {
    // Not all chunks received yet
    return NextResponse.json(
      { message: `Chunk ${chunkIndex} received` },
      { status: 200 },
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

export async function DELETE() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}

export async function OPTIONS() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
