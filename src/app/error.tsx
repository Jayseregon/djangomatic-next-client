"use client";

import { useEffect, type JSX } from "react";

/**
 * Error component renders an error message and a button to reset the error state.
 * It logs the error to the console and provides a way to attempt recovery by re-rendering the segment.
 *
 * @param {Object} props - The props for the Error component.
 * @param {Error} props.error - The error object to be displayed and logged.
 * @param {() => void} props.reset - The function to reset the error state and attempt recovery.
 * @returns {JSX.Element} The rendered Error component.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}): JSX.Element {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
