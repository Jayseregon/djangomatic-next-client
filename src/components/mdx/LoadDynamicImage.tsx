"use client";
import Image from "next/image";
import { useContext } from "react";

import { NonceContext } from "@/src/app/providers";
import { LoadImageProps } from "@/src/interfaces/mdx";

/**
 * LoadDynamicImage component dynamically loads and displays an image.
 * It adjusts styles to maintain the aspect ratio when only one dimension is provided.
 */
export default function LoadDynamicImage({
  imageName,
  height,
  width,
}: LoadImageProps) {
  const imgSrc = `/assets/${imageName}.jpg`;
  const nonce = useContext(NonceContext);

  // Set base dimensions
  const imgWidth = width ?? 200;
  const imgHeight = height ?? 200;

  return (
    <span className="flex flex-col items-center" nonce={nonce}>
      <Image
        alt={imageName}
        className="shadow-xl shadow-slate-600/80 dark:shadow-teal-900/80"
        height={imgHeight}
        nonce={nonce}
        src={imgSrc}
        style={{
          maxWidth: "100%",
          width: "auto",
          height: "auto",
        }}
        width={imgWidth}
      />
    </span>
  );
}
