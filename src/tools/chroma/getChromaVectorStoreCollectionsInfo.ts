import { tool } from "ai";
import { z } from "zod";

import { getChromaCollectionsInfo } from "@/src/actions/chatbot/chroma/action";

export const getChromaVectorStoreCollectionsInfo = tool({
  description:
    "Retrieves a list of all collections currently stored in the Chroma vector database, along with the count of documents within each collection. Use this tool to get an overview of the available datasets in Chroma or to verify the existence and size of specific collections.",
  parameters: z.object({}),
  execute: async () => {
    try {
      const data = await getChromaCollectionsInfo();

      return data;
    } catch {
      return {
        error: "Failed to get Chroma collections info. Please try again later.",
      };
    }
  },
});
