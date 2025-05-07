"use server";

import { Session } from "next-auth";

import { RetrieverResponse } from "@/src/interfaces/chatbot";
import { auth } from "@/auth";

async function _invokeRetriever({
  session,
  endpoint,
  query,
}: {
  session: Session;
  endpoint: string;
  query: string;
}): Promise<RetrieverResponse> {
  const fastapiToken = session.fastapiToken;
  const endpointUrl = process.env.FASTAPI_AI_TOOL_BASE_URL + endpoint;

  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${fastapiToken}`,
    },
    body: JSON.stringify({
      query: query,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to query vector store.");
  }

  return response.json();
}

export async function queryVectorStore({
  query,
  accessSeticsCollection,
}: {
  query: string;
  accessSeticsCollection?: boolean;
}): Promise<RetrieverResponse> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("User is not authenticated.");
    }

    const endpoint = accessSeticsCollection
      ? "/v1/retriever/setics_collection/invoke"
      : "/v1/retriever/base_collection/invoke";

    const response = await _invokeRetriever({
      session: session,
      endpoint: endpoint,
      query: query,
    });

    return response;
  } catch (error) {
    console.error("Error in queryVectorStore:", error);
    throw error;
  }
}
