"use client";

import { useState, useEffect, useRef } from "react";

import { extractAzureFileData, titleCase } from "@/src/lib/utils";

import { BlobProps } from "./BlobStorage";

export const VideosGrid = () => {
  const [blobs, setBlobs] = useState<BlobProps[]>([]);
  const [selectedBlob, setSelectedBlob] = useState<BlobProps | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch the list of blobs on component mount
  useEffect(() => {
    fetch("/api/azure-blob/list?subdir=videos_tutorials", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setBlobs(data);
      });
  }, []);

  useEffect(() => {
    if (selectedBlob) {
      videoRef.current?.load();
    }
  }, [selectedBlob]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    blob: BlobProps,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      setSelectedBlob(blob);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {blobs.map((blob) => {
        const [basename] = extractAzureFileData(blob.name);

        return (
          <div
            key={blob.name}
            className="p-4 border border-divider rounded-lg cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => setSelectedBlob(blob)}
            onKeyDown={(event) => handleKeyDown(event, blob)}
          >
            <video
              ref={videoRef}
              controls
              loop
              muted
              className="w-full h-48 object-cover"
            >
              <source src={blob.url} type={blob.contentType} />
            </video>
            <p className="text-center text-center font-light pt-3">
              {titleCase(basename!)}
            </p>
          </div>
        );
      })}
    </div>
  );
};
