import { useState, useCallback, useEffect } from "react";

import { TowerReportImage } from "@/interfaces/reports";

export const useImageSection = (initialImages: TowerReportImage[] = []) => {
  // console.log("Initial Images: ", initialImages);

  const [images, setImages] = useState<TowerReportImage[]>(() => initialImages);
  const [newlyUploadedImages, setNewlyUploadedImages] = useState<
    TowerReportImage[]
  >([]);

  useEffect(() => {
    if (initialImages?.length > 0 && images.length === 0) {
      setImages(initialImages);
    }
  }, [initialImages]);

  // console.log("Section Images: ", images);

  const handleImagesChange = useCallback((newImages: TowerReportImage[]) => {
    setImages(newImages);
  }, []);

  const handleNewImageUpload = useCallback((image: TowerReportImage) => {
    setNewlyUploadedImages((prev) => [...prev, image]);
  }, []);

  return {
    images,
    newlyUploadedImages,
    setImages,
    handleImagesChange,
    handleNewImageUpload,
    resetNewlyUploaded: () => setNewlyUploadedImages([]),
  };
};
