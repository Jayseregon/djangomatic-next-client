"use client";

import dynamic from "next/dynamic";
import { useContext } from "react";

import { NonceContext } from "@/src/app/providers";

const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false },
);

interface LottiePlayerProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  autoplay?: boolean;
  loop?: boolean;
}

export default function LottieAnimation({
  src,
  className = "",
  style = {},
  autoplay = true,
  loop = true,
}: LottiePlayerProps): JSX.Element {
  const nonce = useContext(NonceContext);

  const handleError = (error: any) => {
    console.error("Lottie Animation Error:", error);
    // Optionally, render a fallback UI
  };

  return (
    <DotLottieReact
      autoplay={autoplay}
      className={className}
      loop={loop}
      nonce={nonce}
      src={src}
      style={style}
      onError={handleError}
    />
  );
}
