"use client";

import { Button } from "@heroui/react";
import { BookText } from "lucide-react";
import React, { useContext } from "react";

import { docsData } from "@/src/config/docsData";
import { NonceContext } from "@/src/app/providers";
import { DocLinkButtonProps } from "@/src/interfaces/docs";

export default function DocLinkButton({
  projectType,
  slug,
}: DocLinkButtonProps) {
  const nonce = useContext(NonceContext);
  const findDocHref = () => {
    const docs = docsData[projectType];
    const doc = docs.find((doc) => doc.href.includes(slug));

    return doc?.href;
  };

  const handleClick = () => {
    const href = findDocHref();

    if (href) {
      window.open(href, "_blank");
    }
  };

  return (
    <div
      nonce={nonce}
      style={{
        position: "fixed",
        top: "5rem", // 20 in rem units
        right: "1.5rem", // 6 in rem units
        zIndex: 50,
      }}
    >
      <Button isIconOnly color="secondary" onPress={handleClick}>
        <BookText />
      </Button>
    </div>
  );
}
