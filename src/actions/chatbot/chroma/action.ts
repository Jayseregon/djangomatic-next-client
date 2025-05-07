"use server";

import {
  ChromaCollectionsInfoResponse,
  ChromaHeartbeatResponse,
  ChromaCollectionSourcesResponse,
  ChromaDeleteSourceResponse,
  AddDocumentsResponse,
  UpdateDocumentsResponse,
} from "@/src/interfaces/chatbot";
import { auth } from "@/auth";

export async function getChromaCollectionsInfo(): Promise<ChromaCollectionsInfoResponse> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const fastapiToken = session.fastapiToken;
    const endpointUrl =
      process.env.FASTAPI_AI_TOOL_BASE_URL + "/v1/chroma-infos/collections";

    const response = await fetch(endpointUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fastapiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get Chroma collections infos.");
    }

    return response.json();
  } catch (error) {
    console.log("Error fetching Chroma collections infos:", error);

    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "Error fetching Chroma collections infos. Please try again later.",
    );
  }
}

export async function getChromaHeartbeat(): Promise<ChromaHeartbeatResponse> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const fastapiToken = session.fastapiToken;
    const endpointUrl =
      process.env.FASTAPI_AI_TOOL_BASE_URL + "/v1/chroma-infos/ping";

    const response = await fetch(endpointUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fastapiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get Chroma heartbeat.");
    }

    return response.json();
  } catch (error) {
    console.log("Error fetching Chroma heartbeat:", error);

    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error fetching Chroma heartbeat. Please try again later.");
  }
}

export async function getChromaSourceByCollections(): Promise<ChromaCollectionSourcesResponse> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const fastapiToken = session.fastapiToken;
    const endpointUrl =
      process.env.FASTAPI_AI_TOOL_BASE_URL +
      "/v1/chroma-infos/collections/list-sources";

    const response = await fetch(endpointUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fastapiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get Chroma collections sources.");
    }

    // Get the actual data from the response
    const data = await response.json();

    return data as ChromaCollectionSourcesResponse;

    // // Ensure we return data in the expected format
    // const formattedData: ChromaCollectionSourcesResponse = {
    //   collections: data.collections || {},
    // };

    // return formattedData;
  } catch (error) {
    console.log("Error fetching Chroma collections sources:", error);

    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "Error fetching Chroma collections sources. Please try again later.",
    );
  }
}

export async function deleteChromaSourceFromCollection(
  collection: string,
  source: string,
): Promise<ChromaDeleteSourceResponse> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const fastapiToken = session.fastapiToken;
    const endpointUrl =
      process.env.FASTAPI_AI_TOOL_BASE_URL +
      "/v1/chroma-infos/collections/delete-source";

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fastapiToken}`,
      },
      body: JSON.stringify({
        collection_name: collection,
        source_name: source,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete Chroma source from collection.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Error deleting Chroma source from collection:", error);

    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "Error deleting Chroma source from collection. Please try again later.",
    );
  }
}

export async function uploadSourceToChromaStore<T extends "add" | "update">(
  operation: T,
  sourceType: "pdf" | "setics" | "web",
  payload: {
    blob_name?: string;
    web_url?: string;
    with_images?: boolean;
  },
): Promise<T extends "add" ? AddDocumentsResponse : UpdateDocumentsResponse> {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const fastapiToken = session.fastapiToken;
    const endpointUrl =
      process.env.FASTAPI_AI_TOOL_BASE_URL +
      `/v1/documents/${sourceType}/${operation}`;

    console.log("Endpoint URL:", endpointUrl);

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fastapiToken}`,
      },
      body: JSON.stringify(payload),
    });

    console.log("Response:", response);

    if (!response.ok) {
      throw new Error("Failed to upload source to Chroma store.");
    }

    const data = await response.json();

    console.log("Response from Chroma store:", data);

    return data as T extends "add"
      ? AddDocumentsResponse
      : UpdateDocumentsResponse;
  } catch (error) {
    console.error("Error uploading source to Chroma store:", error);

    if (error instanceof Error) {
      throw error;
    }
    throw new Error(
      "Error uploading source to Chroma store. Please try again later.",
    );
  }
}
