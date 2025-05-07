import { tool } from "ai";
import { z } from "zod";

import { queryVectorStore } from "@/src/actions/chatbot/retriever/action";

export const queryVectorStoreBaseCollection = tool({
  description: `Retrieve relevant documents from the 'base' Chroma vector store collection (general documents) to provide context for answering user queries about general business operations, tools, processes, etc. This tool does NOT access Setics-specific information.`,
  parameters: z.object({
    query: z
      .string()
      .nonempty()
      .describe(
        "The user query or topic to retrieve relevant general documents for.",
      ),
  }),
  execute: async ({ query }) => {
    try {
      const vectorStoreData = await queryVectorStore({
        query,
        accessSeticsCollection: false,
      });

      if (!vectorStoreData) {
        return "No relevant documents found in the base vector store for the query.";
      }

      console.log(
        "Base vector store query result from tool:\n",
        vectorStoreData,
      );

      return vectorStoreData;
    } catch (error) {
      console.error("Error during queryBaseDocuments execution:", error);

      return `Error querying base collection: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  },
});
