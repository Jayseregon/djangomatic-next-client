"use client";
import { ReactNode, useContext } from "react";

import { NonceContext } from "@/src/app/providers";

interface SnippetProps {
  children?: ReactNode;
}

/**
 * Snippet component renders a styled span element to display code snippets.
 *
 * @param {Object} props - The props for the Snippet component.
 * @param {ReactNode} [props.children] - The content to be displayed inside the snippet.
 * @returns {JSX.Element} The rendered Snippet component.
 */
export default function Snippet({ children }: SnippetProps): JSX.Element {
  const nonce = useContext(NonceContext);

  return (
    <span
      className="inline-block bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-50 p-1 mx-1 font-mono text-sm border-1 border-gray-600 dark:border-gray-50 rounded-md"
      nonce={nonce}
    >
      {children}
    </span>
  );
}
