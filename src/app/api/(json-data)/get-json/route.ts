import { promises as fs } from "fs";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get("file");

  if (!filePath) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  try {
    const jsonContent = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(jsonContent);

    return new NextResponse(JSON.stringify(jsonData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error reading JSON file:", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST() {
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
