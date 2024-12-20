"use client";

import { useContext, useState, useEffect, type JSX } from "react";
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
    setLoading(false); // Ensure we're not in loading state when error occurs
  };

  useEffect(() => {
    // Reset states when src changes
    setLoading(true);
    setError(false);

    // Attempt to load the animation
    const timer = setTimeout(() => {
      if (!error) {
        // Only set loading false if no error occurred
        setLoading(false);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [src, error]); // Add error to dependencies

  // Show loading spinner for both loading and error states
  if (loading || error) {
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
