"use client";

import { useContext, useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { NonceContext } from "@/src/app/providers";

import { LoadingContent } from "./LoadingContent";

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
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = (error: any) => {
    console.error("Lottie Animation Error:", error);
    setError(true);
    setLoading(false);
  };

  useEffect(() => {
    // Simulate loading completion
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingContent />;
  }

  if (error) {
    return <LoadingContent />;
  }

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
