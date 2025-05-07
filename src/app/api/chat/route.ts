import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import {
  InvalidToolArgumentsError,
  NoSuchToolError,
  streamText,
  ToolExecutionError,
} from "ai";

import { getChromaVectorStoreHeartbeat } from "@/tools/chroma/getChromaVectorStoreHeartbeat";
import { getChromaVectorStoreCollectionsInfo } from "@/tools/chroma/getChromaVectorStoreCollectionsInfo";
import { queryVectorStoreBaseCollection } from "@/tools/chroma/queryVectorStoreBaseCollection";
import { queryVectorStoreSeticsCollection } from "@/src/tools/chroma/queryVectorStoreSeticsCollection";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = streamText({
      model: openai("gpt-4.1-mini"),
      system: `You are an AI assistant focused on supporting our team with business-related tasks and questions concerning our daily operations, tools, software, processes, workflows, and more.
Your primary function is to retrieve relevant information from our knowledge base using the available tools. Always prioritize using these tools first.

**Tool Usage Guidelines:**
- Use 'queryVectorStoreBaseCollection' for general business questions (operations, tools, processes).
- Use 'queryVectorStoreSeticsCollection' ONLY for questions specifically about Setics Sttar Advanced Designer (STAD) or Setics Sttar Planner (STPL). Access requires special permissions; if permissions are denied, immediately inform the user with an 'Access Denied' message and do NOT attempt to retrieve or provide any information from any other sources.

You may also use any other available tools as needed, following their descriptions.

**Response Instructions:**
Once you have retrieved information using the tools, you can use your reasoning abilities (e.g., summarizing, analyzing, structuring information, helping draft reports or business cases) to assist the user, but strictly base your response on the retrieved context.
Your scope is limited to our business context. Politely decline any requests unrelated to our business operations, tools, processes, or workflows.
If the tools do not return relevant information for a business-related query, respond with: "Sorry, I could not find relevant information in the knowledge base regarding your question." Do not use your general knowledge for business questions if the tools provide no context.
`,
      messages,
      tools: {
        getChromaVectorStoreHeartbeat,
        getChromaVectorStoreCollectionsInfo,
        queryVectorStoreBaseCollection,
        queryVectorStoreSeticsCollection,
      },
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error("Error during stream processing:", error);

        if (NoSuchToolError.isInstance(error)) {
          return `Error: The model tried to call a tool named '${error.toolName}' which does not exist.`;
        } else if (InvalidToolArgumentsError.isInstance(error)) {
          return `Error: The model called the tool '${error.toolName}' with invalid arguments: ${error.message}`;
        } else if (ToolExecutionError.isInstance(error)) {
          const causeMessage =
            error.cause instanceof Error
              ? error.cause.message
              : String(error.cause ?? error.message); // Handle non-Error causes

          // Check if the cause message is the specific access denied string from the tool itself
          if (causeMessage.startsWith("Access Denied:")) {
            return causeMessage; // Return the denial message directly
          }

          return `Error executing tool '${error.toolName}': ${causeMessage}`;
        } else if (error instanceof Error) {
          return `An unexpected error occurred: ${error.message}`;
        } else {
          return "An unknown error occurred during the chat response generation.";
        }
      },
    });
  } catch (error) {
    console.error("Error in POST handler before streaming:", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
