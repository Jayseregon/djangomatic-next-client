import { openai } from "@ai-sdk/openai";
import {
  InvalidToolArgumentsError,
  NoSuchToolError,
  streamText,
  ToolExecutionError,
} from "ai";

import { convertFahrenheitToCelsius } from "@/src/tools/convertFahrenheitToCelsius";
import { keywordsEmbedding } from "@/src/tools/keywordsEmbedding";
import { weather } from "@/src/tools/weather";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = streamText({
      model: openai("gpt-4o"),
      messages,
      tools: {
        keywordsEmbedding,
        weather,
        convertFahrenheitToCelsius,
      },
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        if (NoSuchToolError.isInstance(error)) {
          return "The model tried to call a unknown tool.";
        } else if (InvalidToolArgumentsError.isInstance(error)) {
          return "The model called a tool with invalid arguments.";
        } else if (ToolExecutionError.isInstance(error)) {
          return "An error occurred during tool execution.";
        } else {
          return "An unknown error occurred.";
        }
      },
    });
  } catch (error) {
    console.error("Error executing model:", error);
  }
}
