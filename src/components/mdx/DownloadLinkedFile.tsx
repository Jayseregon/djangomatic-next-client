"use client";

import React, { useContext, type JSX } from "react";
import { Download } from "lucide-react";
import { Button } from "@heroui/react";

import { NonceContext } from "@/src/app/providers";

export default function DownloadLinkedFile({
  filename,
}: {
  filename: string;
}): JSX.Element {
  const nonce = useContext(NonceContext);
  const downloadUrl = `/download/${filename}`;

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
      <Button
        download
        as="a"
        className="bg-primary text-white max-w-96 h-10"
        href={downloadUrl}
        nonce={nonce}
        radius="full"
        variant="solid"
      >
        <Download />
      </Button>
    </div>
  );
}
