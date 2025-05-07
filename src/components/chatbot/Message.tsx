import React, { memo, useMemo } from "react";
import { marked } from "marked";
import ReactMarkdown from "react-markdown";

import { MessageProps } from "@/src/interfaces/chatbot";

// Helper to split markdown into blocks for memoization
function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);

  return tokens.map((token) => token.raw);
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return <ReactMarkdown>{content}</ReactMarkdown>;
  },
  (prevProps, nextProps) => prevProps.content === nextProps.content,
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    return (
      <>
        {blocks.map((block, index) => (
          <MemoizedMarkdownBlock key={`${id}-block_${index}`} content={block} />
        ))}
      </>
    );
  },
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";

export default function Message({ message }: MessageProps) {
  const isUserMessage = message.role === "user";

  const messageStyle = isUserMessage
    ? "border border-sky-500 text-sky-500 rounded-br-none"
    : "bg-sky-500 text-sky-950 rounded-bl-none";

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
        {isUserMessage ? (
          message.content
        ) : (
          <MemoizedMarkdown content={message.content} id={message.id} />
        )}
      </div>
    </div>
  );
}
