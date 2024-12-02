import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Image URL is required", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new NextResponse("Failed to fetch image", { status: 500 });
    }

    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream";

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);

    return new NextResponse("Error fetching image", { status: 500 });
  }
}
