"use client";

import Image from "next/image";
import React from "react";

type LoadImageProps = {
  imageName: string;
  width?: number;
  height?: number;
};

/**
 * LoadDynamicImage component dynamically loads and displays an image.
 * It constructs the image source URL based on the provided imageName and optional width and height.
 *
 * @param {Object} props - The props for the LoadDynamicImage component.
 * @param {string} props.imageName - The name of the image to load.
 * @param {number} [props.width=200] - The width of the image.
 * @param {number} [props.height=200] - The height of the image.
 * @returns {JSX.Element} The rendered LoadDynamicImage component.
 */
export const LoadDynamicImage = ({
  imageName,
  width = 200,
  height = 200,
}: LoadImageProps): JSX.Element => {
  const imgSrc = `/docs/${imageName}.jpg`;

  return (
    <span className="flex flex-col items-center">
      <Image
        alt={imageName}
        className="shadow-xl shadow-slate-600/80 dark:shadow-teal-900/80"
        height={height}
        src={imgSrc}
        width={width}
      />
    </span>
  );
};
