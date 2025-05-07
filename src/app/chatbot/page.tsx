"use client";

import { useChat, Message as UIMessage } from "@ai-sdk/react";
import { Button, Input, Tooltip } from "@heroui/react";
import { BotMessageSquare, RefreshCcw, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import Message from "@/components/chatbot/Message";
import { UserAccessChatbot } from "@/components/chatbot/UserAccess";
import ErrorBoundary from "@/src/components/error/ErrorBoundary";
import {
  initiateChatInteraction,
  finalizeChatInteraction,
  incrementReloadCount,
  incrementStopCount,
  InitialInteractionDetails,
  FinalInteractionDetails,
} from "@/actions/chatbot/tracking/action";

export default function ChatbotPage() {
  const { data: session } = useSession();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const requestStartTimeRef = useRef<number | null>(null);
  const currentInteractionLogIdRef = useRef<string | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalUseChatHandleSubmit,
    reload: originalReload,
    stop: originalStop,
    error: chatError,
    id: chatSessionId,
    status,
  } = useChat({
    maxSteps: 5,
    experimental_throttle: 50,
    id: currentChatId || undefined,
    onFinish: async (message, { usage }) => {
      const endTime = Date.now();
      const startTime = requestStartTimeRef.current;

      console.log(
        "Length:",
        message.content.length,
        "Usage:",
        usage,
        "Chat Status:",
        status,
      );

      if (
        message.content &&
        message.content.length > 0 &&
        session?.user?.email &&
        currentInteractionLogIdRef.current
      ) {
        const durationMs = startTime ? endTime - startTime : undefined;

        const finalDetails: FinalInteractionDetails = {
          promptTokens: usage?.promptTokens,
          completionTokens: usage?.completionTokens,
          totalTokens: usage?.totalTokens,
          durationMs: durationMs,
          assistantMessageLength: message.content.length,
          status: "ready",
        };

        try {
          await finalizeChatInteraction(
            currentInteractionLogIdRef.current,
            finalDetails,
          );
        } catch (error) {
          console.error(
            "Failed to finalize chat interaction onFinish (with content):",
            error,
          );
        }
        requestStartTimeRef.current = null;
        currentInteractionLogIdRef.current = null;
      } else if (
        session?.user?.email &&
        currentInteractionLogIdRef.current &&
        status === "ready"
      ) {
        console.log(
          "onFinish called with empty content, but chat status is 'ready'.",
        );
      }
    },
    onError: async (error) => {
      const endTime = Date.now();
      const startTime = requestStartTimeRef.current;

      console.error("Chat error:", error);

      if (session?.user?.email && currentInteractionLogIdRef.current) {
        const durationMs = startTime ? endTime - startTime : undefined;
        const finalDetails: FinalInteractionDetails = {
          durationMs: durationMs,
          status: "error",
          errorDetails: error.message,
        };

        try {
          await finalizeChatInteraction(
            currentInteractionLogIdRef.current,
            finalDetails,
          );
        } catch (dbError) {
          console.error(
            "Failed to finalize chat interaction on Error:",
            dbError,
          );
        }
      }
      requestStartTimeRef.current = null;
      currentInteractionLogIdRef.current = null;
    },
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatSessionId && !currentChatId) {
      setCurrentChatId(chatSessionId);
    }
  }, [chatSessionId, currentChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    currentInteractionLogIdRef.current = null;
    requestStartTimeRef.current = Date.now();

    const userMessageContentLength = input.length;

    if (session?.user?.email && session.user.name && chatSessionId) {
      try {
        const initialDetails: InitialInteractionDetails = {
          chatId: chatSessionId,
          userMessageLength: userMessageContentLength,
          status: "submitted",
        };
        const result = await initiateChatInteraction(
          session.user.email,
          session.user.name,
          initialDetails,
        );

        if (result) {
          currentInteractionLogIdRef.current = result.logId;
        } else {
          requestStartTimeRef.current = null;
        }
      } catch (error) {
        console.error("Failed to track chat interaction:", error);
        requestStartTimeRef.current = null;
      }
    }

    originalUseChatHandleSubmit(e);
  };

  const handleReload = async () => {
    if (session?.user?.email) {
      try {
        await incrementReloadCount(session.user.email);

        currentInteractionLogIdRef.current = null;
        requestStartTimeRef.current = Date.now();

        const lastUserMessage = messages.findLast((m) => m.role === "user");

        if (lastUserMessage && chatSessionId && session.user.name) {
          const initialDetails: InitialInteractionDetails = {
            chatId: chatSessionId,
            userMessageLength: lastUserMessage.content.length,
            status: "submitted",
          };
          const result = await initiateChatInteraction(
            session.user.email,
            session.user.name,
            initialDetails,
          );

          if (result) {
            currentInteractionLogIdRef.current = result.logId;
            console.log("Reload Interaction initiated:", result.logId);
          } else {
            requestStartTimeRef.current = null;
          }
        }
        originalReload();
      } catch (error) {
        console.error("Failed to track reload or execute reload:", error);
        if (!currentInteractionLogIdRef.current)
          requestStartTimeRef.current = null;
      }
    } else {
      originalReload();
    }
  };

  const handleStop = () => {
    const endTime = Date.now();
    const startTime = requestStartTimeRef.current;

    if (session?.user?.email) {
      try {
        incrementStopCount(session.user.email);
        if (currentInteractionLogIdRef.current) {
          const finalDetails: FinalInteractionDetails = {
            status: "stopped",
            errorDetails: "User stopped generation",
            durationMs: startTime ? endTime - startTime : undefined,
          };

          finalizeChatInteraction(
            currentInteractionLogIdRef.current,
            finalDetails,
          )
            .then(() =>
              console.log(
                "Interaction finalized on Stop:",
                currentInteractionLogIdRef.current,
              ),
            )
            .catch((error) => console.error("Error finalizing on stop:", error))
            .finally(() => {
              currentInteractionLogIdRef.current = null;
            });
        }
        originalStop();
      } catch (error) {
        console.error("Failed to track stop or execute stop:", error);
      }
    } else {
      originalStop();
    }
    requestStartTimeRef.current = null;
  };

  if (!session) return <UnAuthenticated />;
  if (!session.user.email || !session.user.name) return <UnAuthenticated />;

  return (
    <UserAccessChatbot email={session.user.email}>
      <ErrorBoundary fallback={<div>Error loading the chat</div>}>
        <div className="fixed inset-x-0 top-[64px] bottom-[64px] flex flex-col">
          <div className="relative flex-1">
            <div className="absolute inset-0 overflow-y-auto">
              <div className="flex flex-col gap-4 max-w-4xl mx-auto p-4">
                {messages.map((m: UIMessage) => (
                  <Message key={m.id} message={m} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          <div className="flex-none bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
            {chatError && (
              <div className="text-red-500 mb-4">
                Error: {chatError.message || "An unknown error occurred."}
              </div>
            )}
            <form
              className="w-full max-w-4xl mx-auto flex items-center gap-2"
              onSubmit={handleSubmit}
            >
              <Input
                aria-label="chatbot-input"
                className="h-10 flex-1"
                classNames={{
                  input:
                    "border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0",
                  inputWrapper: "bg-background border border-primary",
                }}
                color="primary"
                placeholder="How can I help you today?"
                radius="full"
                startContent={
                  <BotMessageSquare className="pointer-events-none flex-shrink-0" />
                }
                value={input}
                onChange={handleInputChange}
              />
              <Button
                isIconOnly
                aria-label="Reload"
                className="p-2 bg-background border border-primary text-primary rounded-full"
                onPress={handleReload}
              >
                <Tooltip content="Regenerate Response" placement="top">
                  <RefreshCcw size={18} />
                </Tooltip>
              </Button>
              <Button
                isIconOnly
                aria-label="Stop"
                className="p-2 bg-background border border-primary text-primary rounded-full"
                onPress={handleStop}
              >
                <Tooltip content="Stop Generation" placement="top">
                  <Square size={18} />
                </Tooltip>
              </Button>
            </form>
          </div>
        </div>
      </ErrorBoundary>
    </UserAccessChatbot>
  );
}
