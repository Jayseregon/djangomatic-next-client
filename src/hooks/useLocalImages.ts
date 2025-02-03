import { useCallback, useMemo, useRef, useState } from "react";

import { LocalImages, TowerReportImage } from "@/src/interfaces/reports";

interface UseLocalImagesProps {
  images: TowerReportImage[];
  isFrontcover?: boolean;
}

export function useLocalImages({ images, isFrontcover }: UseLocalImagesProps) {
  const [localImages, setLocalImages] = useState<LocalImages[]>([]);
  const isInitialized = useRef(false);

  const initialLocalImages = useMemo(
    () =>
      images.map((image, index) => ({
        file: null,
        url: image.url,
        label: isFrontcover ? "Front Cover" : image.label,
        imgIndex: image.imgIndex ?? index,
        deficiency_check_procedure: image.deficiency_check_procedure,
        deficiency_recommendation: image.deficiency_recommendation,
      })),
    [images, isFrontcover],
  );

  const initLocalImages = useCallback(() => {
    if (!isInitialized.current && images.length > 0) {
      setLocalImages([...initialLocalImages]);
      isInitialized.current = true;
    }
  }, [images.length, initialLocalImages]);

  const findFirstAvailableIndex = useCallback(() => {
    const indices = localImages.map((img) => img.imgIndex);
    let idx = 0;

    while (indices.includes(idx)) {
      idx++;
    }

    return idx;
  }, [localImages]);

  const sortedLocalImages = useMemo(
    () => [...localImages].sort((a, b) => a.imgIndex - b.imgIndex),
    [localImages],
  );

  return {
    localImages,
    setLocalImages,
    initLocalImages,
    findFirstAvailableIndex,
    sortedLocalImages,
  };
}
