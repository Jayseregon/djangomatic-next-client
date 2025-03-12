import { tool } from "ai";
import { z } from "zod";

import { getKeywordsEmbeddings } from "@/src/actions/chatbot/action";

export const keywordsEmbedding = tool({
  description: "Get the embeddings of a list of keywords",
  parameters: z.object({
    keywords: z.array(z.string()).describe("The list of keywords"),
  }),
  execute: async ({ keywords }) => {
    try {
      const embeddings = await getKeywordsEmbeddings(keywords);

      return embeddings;
    } catch {
      return {
        error: "Failed to get keywords embeddings. Please try again later.",
      };
    }
  },
});
