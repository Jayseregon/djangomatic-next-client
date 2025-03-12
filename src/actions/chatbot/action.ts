"use server";

import { KeywordsEmbeddingResponse } from "@/src/interfaces/chatbot";
import { auth } from "@/auth";

export async function getKeywordsEmbeddings(
  keywords: string[],
): Promise<KeywordsEmbeddingResponse> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const fastapiToken = session.fastapiToken;
    const endpointUrl =
      process.env.FASTAPI_AI_TOOL_BASE_URL + "/v1/embedding/keywords";

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fastapiToken}`,
      },
      body: JSON.stringify({
        keywords: keywords,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get keywords embeddings.");
    }

    return response.json();
  } catch (error) {
    console.log("Error fetching keywords embeddings:", error);
    throw new Error(
      "Error fetching keywords embeddings. Please try again later.",
    );
  }
}
