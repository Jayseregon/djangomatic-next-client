"use client";

import { useChat } from "@ai-sdk/react";
import { Input } from "@heroui/react";
import { BotMessageSquare } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import Message from "@/components/chatbot/Message";
import { UserAccessChatbot } from "@/components/chatbot/UserAccess";
import ErrorBoundary from "@/src/components/error/ErrorBoundary";

export default function ChatbotPage() {
  const { data: session } = useSession();
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!session) return <UnAuthenticated />;

  if (!session.user.email) return <UnAuthenticated />;

  return (
    <UserAccessChatbot email={session.user.email}>
      <ErrorBoundary fallback={<div>Error loading the chat</div>}>
        <div className="fixed inset-x-0 top-[64px] bottom-[64px] flex flex-col">
          <div className="relative flex-1">
            <div className="absolute inset-0 overflow-y-auto">
              <div className="flex flex-col gap-4 max-w-4xl mx-auto p-4">
                {messages.map((m) => (
                  <Message key={m.id} message={m} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          <div className="flex-none bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
            <form className="w-full max-w-4xl mx-auto" onSubmit={handleSubmit}>
              <Input
                aria-label="chatbot-input"
                className="h-10 w-full"
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
            </form>
          </div>
        </div>
      </ErrorBoundary>
    </UserAccessChatbot>
  );
}
