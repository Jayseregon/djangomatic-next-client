"use server";

import { KeywordsEmbeddingResponse } from "@/src/interfaces/chatbot";

export async function getKeywordsEmbeddings(
  keywords: string[],
): Promise<KeywordsEmbeddingResponse> {
  try {
    const response = await fetch(
      "https://rag-ai-toolbox.azurewebsites.net/embeddings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: keywords,
        }),
      },
    );

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
