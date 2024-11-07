"use client";
import Image from "next/image";
import { useContext } from "react";

import { NonceContext } from "@/src/app/providers";

type LoadImageProps = {
  imageName: string;
  // width: number;
  // height: number;
};

/**
 * LoadDynamicImage component dynamically loads and displays an image.
 * It adjusts styles to maintain the aspect ratio when only one dimension is provided.
 */
export const LoadDynamicImage = ({
  imageName,
  // width,
  // height,
}: LoadImageProps): JSX.Element => {
  // const nonce = useContext(NonceContext);
  const imgSrc = `/docs/${imageName}.jpg`;
  const nonce = useContext(NonceContext);

  return (
    <span className="flex flex-col items-center" nonce={nonce}>
      <Image
        alt={imageName}
        className="shadow-xl shadow-slate-600/80 dark:shadow-teal-900/80"
        height={200}
        nonce={nonce}
        src={imgSrc}
        style={{ width: "50%", height: "auto" }}
        width={200}
      />
    </span>
  );
};
