import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");
  const urls = searchParams.get("urls"); // New parameter for batch requests

  // Handle batch request
  if (urls) {
    try {
      const imageUrls = JSON.parse(decodeURIComponent(urls));
      const imagePromises = imageUrls.map(async (url: string) => {
        const response = await fetch(url, {
          next: { revalidate: 3600 },
        });

        if (!response.ok) return null;
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        // Convert ArrayBuffer to Array of bytes
        const bytes = Array.from(new Uint8Array(arrayBuffer));

        console.log("Fetched images in batch");

        return {
          url,
          data: bytes, // Send as regular array
          contentType:
            response.headers.get("Content-Type") || "application/octet-stream",
        };
      });

      const images = await Promise.all(imagePromises);

      return NextResponse.json(images, {
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=1800",
        },
      });
    } catch (error) {
      console.error("Error fetching images batch:", error);

      return new NextResponse("Error fetching images batch", { status: 500 });
    }
  }

  // Handle single image request (existing code)
  if (!imageUrl) {
    return new NextResponse("Image URL is required", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl, {
      // Enable caching with revalidation
      next: { revalidate: 3600 }, // Revalidate every 24 hours
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch image", { status: 500 });
    }

    const contentType =
      response.headers.get("Content-Type") || "application/octet-stream";

    console.log("Fetched image solo");

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        // Set caching headers
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);

    return new NextResponse("Error fetching image", { status: 500 });
  }
}
