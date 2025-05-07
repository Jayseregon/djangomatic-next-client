"use server";

import { prisma } from "@/lib/prismaClient";
import { handlePrismaError } from "@/lib/prismaErrorHandler";
import { ChatbotUsage, ChatInteractionLog } from "@/interfaces/rnd";

export type InitialInteractionDetails = {
  chatId: string;
  userMessageLength: number;
  status: "submitted";
};

export type FinalInteractionDetails = {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  durationMs?: number;
  assistantMessageLength?: number;
  status: "ready" | "error" | "stopped";
  errorDetails?: string;
};

export async function initiateChatInteraction(
  email: string,
  username: string,
  initialDetails: InitialInteractionDetails,
): Promise<{ usage: ChatbotUsage; logId: string } | null> {
  try {
    let usage = await prisma.chatbotUsage.findUnique({
      where: { email },
    });

    if (usage) {
      usage = await prisma.chatbotUsage.update({
        where: { email },
        data: {
          messageCount: { increment: 1 },
          username: username, // Keep username updated
          // lastUsed is auto-updated
        },
      });
    } else {
      usage = await prisma.chatbotUsage.create({
        data: {
          email,
          username,
          messageCount: 1,
        },
      });
    }

    const newLog = await prisma.chatInteractionLog.create({
      data: {
        chatbotUsageId: usage.id,
        chatId: initialDetails.chatId,
        userMessageLength: initialDetails.userMessageLength,
        status: initialDetails.status,
      },
    });

    // Casting to ChatbotUsage interface type after Prisma operation
    const typedUsage = usage as ChatbotUsage;

    return { usage: typedUsage, logId: newLog.id };
  } catch (error: any) {
    console.error("Error initiating chat interaction:", error);
    const formattedError = handlePrismaError(error);

    // For server actions, re-throw a simpler error or handle as per your app's needs
    if (formattedError.status >= 500) {
      throw new Error("Database error while initiating chat interaction");
    } else {
      throw new Error(
        formattedError.statusText || "Failed to initiate chat interaction",
      );
    }
  }
}

export async function finalizeChatInteraction(
  logId: string,
  finalDetails: FinalInteractionDetails,
): Promise<ChatInteractionLog | null> {
  try {
    const updatedLog = await prisma.chatInteractionLog.update({
      where: { id: logId },
      data: {
        promptTokens: finalDetails.promptTokens,
        completionTokens: finalDetails.completionTokens,
        totalTokens: finalDetails.totalTokens,
        durationMs: finalDetails.durationMs,
        assistantMessageLength: finalDetails.assistantMessageLength,
        status: finalDetails.status,
        errorDetails: finalDetails.errorDetails,
      },
    });

    return updatedLog as ChatInteractionLog;
  } catch (error: any) {
    console.error("Error finalizing chat interaction:", error);
    const formattedError = handlePrismaError(error);

    if (formattedError.status >= 500) {
      throw new Error("Database error while finalizing chat interaction");
    } else {
      throw new Error(
        formattedError.statusText || "Failed to finalize chat interaction",
      );
    }
  }
}

export async function incrementReloadCount(email: string) {
  try {
    return await prisma.chatbotUsage.update({
      where: { email },
      data: { reloadCount: { increment: 1 } },
    });
  } catch (error: any) {
    console.error("Error incrementing reload count:", error);
    const formattedError = handlePrismaError(error);

    if (formattedError.status >= 500) {
      throw new Error("Database error while incrementing reload count");
    } else {
      throw new Error(
        formattedError.statusText || "Failed to increment reload count",
      );
    }
  }
}

export async function incrementStopCount(email: string) {
  try {
    return await prisma.chatbotUsage.update({
      where: { email },
      data: { stopCount: { increment: 1 } },
    });
  } catch (error: any) {
    console.error("Error incrementing stop count:", error);
    const formattedError = handlePrismaError(error);

    if (formattedError.status >= 500) {
      throw new Error("Database error while incrementing stop count");
    } else {
      throw new Error(
        formattedError.statusText || "Failed to increment stop count",
      );
    }
  }
}

export async function getChatbotUsageStats() {
  try {
    return await prisma.chatbotUsage.findMany({
      orderBy: {
        messageCount: "desc",
      },
    });
  } catch (error: any) {
    console.error("Error getting chatbot usage stats:", error);
    const formattedError = handlePrismaError(error);

    if (formattedError.status >= 500) {
      throw new Error(
        "Database error while retrieving chatbot usage statistics",
      );
    } else {
      throw new Error(
        formattedError.statusText ||
          "Failed to retrieve chatbot usage statistics",
      );
    }
  }
}

export async function getChatInteractionLogsByEmail(
  email: string,
  page: number = 1,
  pageSize: number = 20,
) {
  try {
    const user = await prisma.chatbotUsage.findUnique({ where: { email } });

    if (!user) {
      return { logs: [], totalCount: 0 };
    }
    const totalCount = await prisma.chatInteractionLog.count({
      where: { chatbotUsageId: user.id },
    });
    const logs = await prisma.chatInteractionLog.findMany({
      where: { chatbotUsageId: user.id },
      orderBy: { timestamp: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { logs, totalCount };
  } catch (error: any) {
    console.error("Error getting chat interaction logs by email:", error);
    const formattedError = handlePrismaError(error);

    if (formattedError.status >= 500) {
      throw new Error("Database error while retrieving chat interaction logs");
    } else {
      throw new Error(
        formattedError.statusText || "Failed to retrieve chat interaction logs",
      );
    }
  }
}
