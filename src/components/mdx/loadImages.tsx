"use client";
import Image from "next/image";

// import { NonceContext } from "@/contexts/NonceProvider";

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

  return (
    <span className="flex flex-col items-center">
      <Image
        alt={imageName}
        className="shadow-xl shadow-slate-600/80 dark:shadow-teal-900/80"
        height={200}
        src={imgSrc}
        style={{ width: "50%", height: "auto" }}
        width={200}
      />
    </span>
  );
};
