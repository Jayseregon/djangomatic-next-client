import { tool } from "ai";
import { z } from "zod";

import { getChromaHeartbeat } from "@/src/actions/chatbot/chroma/action";

export const getChromaVectorStoreHeartbeat = tool({
  description:
    "Checks the operational status of the Chroma vector database server. Use this tool to verify if the Chroma server is running and responsive, especially when troubleshooting connection issues or before attempting operations that depend on Chroma.",
  parameters: z.object({}),
  execute: async () => {
    try {
      const data = await getChromaHeartbeat();

      return data;
    } catch {
      return {
        error: "Failed to get Chroma collections info. Please try again later.",
      };
    }
  },
});
