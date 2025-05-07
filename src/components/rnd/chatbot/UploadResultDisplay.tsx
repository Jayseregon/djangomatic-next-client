"use client";

import { UploadResultDisplayProps } from "@/interfaces/chatbot";

export const UploadResultDisplay = ({
  result,
  sourceLabel = "Filename",
}: UploadResultDisplayProps) => {
  if (!result) return null;

  return (
    <div className="bg-foreground/5 p-3 rounded-md border border-foreground/10">
      <h5 className="text-sm font-semibold mb-1">Upload Results:</h5>
      <div className="text-xs space-y-1">
        <p>
          <span className="font-light">Documents Added: </span>
          <span className="font-bold">{result.added_count}</span>
        </p>
        {"skipped_count" in result ? (
          <p>
            <span className="font-light">Documents Skipped: </span>
            <span className="font-bold">{result.skipped_count}</span>
          </p>
        ) : (
          <p>
            <span className="font-light">Documents Replaced: </span>
            <span className="font-bold">{result.docs_replaced}</span>
          </p>
        )}
        <p>
          <span className="font-light">{sourceLabel}: </span>
          <span className="font-bold">{result.filename}</span>
        </p>
      </div>
    </div>
  );
};
