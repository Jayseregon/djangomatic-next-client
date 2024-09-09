import { progressEmitter } from "@/src/lib/progressEmitter";

/**
 * Handles GET requests for progress updates.
 * This endpoint uses Server-Sent Events (SSE) to send real-time progress updates to the client.
 *
 * @param {Request} request - The incoming HTTP request.
 * @returns {Response} - The HTTP response with the SSE stream.
 */
export async function GET(request: Request): Promise<Response> {
  // Extract the UUID from the query parameters
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");

  // If UUID is not provided, return a 400 Bad Request response
  if (!uuid) {
    console.error("UUID is required");

    return new Response(JSON.stringify({ message: "UUID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create a new ReadableStream for the SSE
  const stream = new ReadableStream({
    start(controller) {
      /**
       * Event handler for progress updates.
       * Enqueues progress data to the SSE stream if the UUID matches.
       *
       * @param {Object} progress - The progress update object.
       * @param {string} progress.uuid - The UUID of the upload.
       * @param {number} progress.loadedBytes - The number of bytes uploaded.
       */
      const onProgress = (progress: { uuid: string; loadedBytes: number }) => {
        if (progress.uuid === uuid) {
          console.log(`Sending progress: ${progress.loadedBytes} bytes`);
          try {
            controller.enqueue(`data: ${JSON.stringify(progress)}\n\n`);
          } catch (error) {
            console.error("Error enqueuing progress data:", error);
          }
        }
      };

      // Listen for progress events
      progressEmitter.on("progress", onProgress);

      // Ensure the stream stays open by sending keep-alive messages every 20 seconds
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(": keep-alive\n\n");
        } catch (error) {
          console.error("Error enqueuing keep-alive data:", error);
          clearInterval(keepAlive);
        }
      }, 20000);

      // Cleanup function to stop listening for progress events and clear the keep-alive interval
      controller.close = () => {
        clearInterval(keepAlive);
        progressEmitter.off("progress", onProgress);
      };
    },
    cancel() {
      // Log when the SSE stream is cancelled
      console.log(`SSE for UUID: ${uuid} has been cancelled`);
    },
  });

  // Return the SSE stream response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
