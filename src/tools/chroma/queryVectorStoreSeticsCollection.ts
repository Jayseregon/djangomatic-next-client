import { tool } from "ai";
import { z } from "zod";

import { queryVectorStore } from "@/src/actions/chatbot/retriever/action";
import { auth } from "@/auth";
import { fetchUserServer } from "@/actions/generic/action";

export const queryVectorStoreSeticsCollection = tool({
  description: `Retrieve relevant documents specifically about Setics Sttar Advanced Designer (STAD) or Setics Sttar Planner (STPL) from the restricted 'Setics' Chroma vector store collection.
IMPORTANT: Access to this tool requires specific user permissions. If the user lacks permission, the tool will return an 'Access Denied' message. Only use this tool if the query is explicitly about STAD or STPL.`,
  parameters: z.object({
    query: z
      .string()
      .nonempty()
      .describe(
        "The user query or topic specifically about Setics STAD or STPL.",
      ),
  }),
  execute: async ({ query }) => {
    try {
      const session = await auth();

      if (!session?.user?.email) {
        return "Error: Could not determine user authentication status.";
      }

      const userData = await fetchUserServer(session.user.email);

      if (!userData) {
        return "Error: Could not retrieve user data.";
      }

      if (!userData.canAccessSeticsCollection) {
        console.log(
          `Permission denied for user ${session.user.email} to access Setics collection.`,
        );

        return "Access Denied: You do not have permission to query Setics documents.";
      }

      console.log(
        `User ${session.user.email} has permission. Querying Setics collection...`,
      );
      const vectorStoreData = await queryVectorStore({
        query,
        accessSeticsCollection: true,
      });

      if (!vectorStoreData) {
        return "No relevant documents found in the Setics vector store for the query.";
      }

      console.log(
        "Setics vector store query result from tool:\n",
        vectorStoreData,
      );

      return vectorStoreData;
    } catch (error) {
      console.error("Error during querySeticsDocuments execution:", error);

      if (
        error instanceof Error &&
        error.message.includes(
          "not have permission to access the Setics collection.",
        )
      ) {
        return "Access Denied: You do not have permission to query Setics documents.";
      }

      return `Error querying Setics collection: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  },
});
