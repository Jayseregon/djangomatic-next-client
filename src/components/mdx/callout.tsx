"use client";

import { ReactNode, useContext, type JSX } from "react";

import { cn } from "@/lib/utils";
import { NonceContext } from "@/src/app/providers";

interface CalloutProps {
  children?: ReactNode;
  type?: "default" | "warning" | "danger";
}

/**
 * Callout component renders a styled callout box with different types (default, warning, danger).
 * It uses conditional styling based on the type prop to display different colors and borders.
 *
 * @param {Object} props - The props for the Callout component.
 * @param {ReactNode} [props.children] - The content to be displayed inside the callout.
 * @param {"default" | "warning" | "danger"} [props.type="default"] - The type of the callout, which determines its styling.
 * @returns {JSX.Element} The rendered Callout component.
 */
export default function Callout({
  children,
  type = "default",
  ...props
}: CalloutProps): JSX.Element {
  const nonce = useContext(NonceContext);

  return (
    <div
      className={cn("my-3 px-4 mx-auto rounded-md border-2 border-l-8 w-full", {
        "border-red-900 bg-red-50 prose text-red-900": type === "danger",
        "border-yellow-900 bg-yellow-50 prose text-yellow-900":
          type === "warning",
      })}
      nonce={nonce}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
}
