import React from "react";

import { MessageProps } from "@/src/interfaces/chatbot";

export default function Message({ message }: MessageProps) {
  const isUserMessage = message.role === "user";

  const messageStyle = isUserMessage
    ? "bg-sky-500 text-sky-950 rounded-br-none"
    : "bg-amber-500 text-amber-950 rounded-bl-none";

  return (
    <div
      className={`
        group flex ${isUserMessage ? "justify-end" : "justify-start"}
        mb-2 max-w-[75%] ${isUserMessage ? "ml-auto" : "mr-auto"}
      `}
    >
      <div
        className={`
        rounded-2xl px-4 py-2 break-words shadow-sm
        ${messageStyle}
      `}
      >
        {message.content}
      </div>
    </div>
  );
}
