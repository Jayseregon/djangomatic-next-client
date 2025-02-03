"use client";

import { useState, useEffect, useRef, type JSX } from "react";

import { extractAzureFileData, titleCase } from "@/src/lib/utils";
import { VideosGridFilteredProps } from "@/src/interfaces/docs";
import { BlobProps } from "@/src/interfaces/admin";

/**
 * VideosGridFiltered component renders a grid of video blobs filtered by the selected category.
 * It allows users to select a video and play it within the grid.
 *
 * @param {Object} props - The props for the VideosGridFiltered component.
 * @param {string} props.selectedCategory - The category to filter the video blobs by.
 * @returns {JSX.Element} The rendered VideosGridFiltered component.
 */
export const VideosGrids = ({
  selectedCategory,
}: VideosGridFilteredProps): JSX.Element => {
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
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Reload the video when a new blob is selected
  useEffect(() => {
    if (selectedBlob) {
      videoRef.current?.load();
    }
  }, [selectedBlob]);

  /**
   * Handles key down events for selecting a video blob.
   *
   * @param {React.KeyboardEvent<HTMLDivElement>} event - The keyboard event.
   * @param {BlobProps} blob - The blob to be selected.
   */
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    blob: BlobProps,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      setSelectedBlob(blob);
    }
  };

  // Filter blobs based on selected category
  const filteredBlobs = blobs.filter(
    (blob) => blob.tags.categoryName === selectedCategory,
  );

  return (
    <div className="grid grid-cols-3 gap-4" data-testid="videos-grid">
      {filteredBlobs.map((blob) => {
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
              data-testid="video-player"
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
