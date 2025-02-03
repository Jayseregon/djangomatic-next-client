import { useState, useCallback } from "react";

import { TowerReportImage } from "@/interfaces/reports";

export const useImageSection = (initialImages: TowerReportImage[] = []) => {
  const [images, setImages] = useState<TowerReportImage[]>(initialImages);
  const [newlyUploadedImages, setNewlyUploadedImages] = useState<
    TowerReportImage[]
  >([]);

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
