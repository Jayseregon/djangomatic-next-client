import React, { useEffect } from "react";

export const DotLottieReact = ({
  className,
  style,
  onError,
  src,
  ...props
}: {
  className?: string;
  style?: React.CSSProperties;
  onError?: (error: any) => void;
  src?: string;
  [key: string]: any;
}) => {
  useEffect(() => {
    if (src === "invalid-src" && onError) {
      // Call onError synchronously
      onError(new Error("Failed to load animation"));
    }
  }, [src, onError]);

  // Don't render anything for invalid src
  if (src === "invalid-src") {
    return null;
  }

  return (
    <div
      className={className}
      data-testid="lottie-animation"
      style={style}
      {...props}
    />
  );
};

describe("Lottie Mock", () => {
  it("exists", () => {
    expect(DotLottieReact).toBeDefined();
  });
});
