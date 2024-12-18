"use client";

import { ReactNode, useContext, type JSX } from "react";

import { NonceContext } from "@/src/app/providers";

interface QuoteProps {
  children?: ReactNode;
}

/**
 * Quote component renders a styled span element to display quoted text.
 *
 * @param {Object} props - The props for the Quote component.
 * @param {ReactNode} [props.children] - The content to be displayed inside the quote.
 * @returns {JSX.Element} The rendered Quote component.
 */
export default function Quote({ children }: QuoteProps): JSX.Element {
  const nonce = useContext(NonceContext);

  return (
    <span
      className="inline-block text-gray-600 dark:text-gray-50 italic font-mono text-sm"
      nonce={nonce}
    >
      {children}
    </span>
  );
}
