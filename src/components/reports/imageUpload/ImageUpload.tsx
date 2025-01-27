import React, { useEffect, memo, useCallback, useMemo } from "react";
import { Reorder, useDragControls } from "motion/react";
import { Grip } from "lucide-react";

import {
  ImageUploadProps,
  LocalImages,
  TowerReportImage,
} from "@/src/interfaces/reports";
import { AddButton } from "@/src/components/ui/formInput";
import { useImageUpload } from "@/src/hooks/useImageUpload";
import { useLocalImages } from "@/src/hooks/useLocalImages";

import { ImageRow } from "./ImageRow";
import { FormInputRow } from "./FormInputRow";

const ImageUpload = ({
  images,
  onImagesChange,
  subdir,
  onNewImageUpload,
  newImageButtonName,
  labelPlaceholder,
  labelOptions,
  maxImages,
  isFrontcover,
  isDeficiency = false,
}: ImageUploadProps) => {
  const {
    localImages,
    setLocalImages,
    initLocalImages,
    findFirstAvailableIndex,
    sortedLocalImages,
  } = useLocalImages({ images, isFrontcover });

  const dragControls = useDragControls();
  const { uploadImageToAzure } = useImageUpload();

  useEffect(() => {
    initLocalImages();
  }, [initLocalImages]);

  const handleImageChange = useCallback(
    async (index: number, files: FileList) => {
      if (!files?.[0]) return;

      const file = files[0];
      const newImages = [...localImages];
      const currentImage = newImages[index];

      const label = isFrontcover ? "Front Cover" : currentImage.label;
      const { url, azureId, id } = await uploadImageToAzure(
        file,
        label,
        subdir,
      );

      const newImage = {
        id,
        url,
        label,
        imgIndex: index,
        azureId,
        deficiency_check_procedure: isDeficiency
          ? currentImage.deficiency_check_procedure
          : "",
        deficiency_recommendation: isDeficiency
          ? currentImage.deficiency_recommendation
          : "",
        siteProjectId: null,
        frontProjectId: null,
        deficiencyProjectId: null,
      };

      onImagesChange([...images, newImage]);
      newImages[index] = { ...currentImage, file, url, imgIndex: index };
      onNewImageUpload(newImage);
      setLocalImages(newImages);
    },
    [
      localImages,
      images,
      isFrontcover,
      isDeficiency,
      onImagesChange,
      onNewImageUpload,
      uploadImageToAzure,
      subdir,
    ],
  );

  const handleLabelChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      if (isFrontcover) return;

      const { value } = e.target;

      setLocalImages((prev) =>
        prev.map((img, i) => (i === index ? { ...img, label: value } : img)),
      );

      onImagesChange(
        images.map((img, i) => (i === index ? { ...img, label: value } : img)),
      );
    },
    [isFrontcover, images, onImagesChange],
  );

  const handleDeficiencyCheckProcedureChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const index = parseInt(e.target.name.split("-")[1], 10);

      if (isFrontcover) return;

      const { value } = e.target;

      setLocalImages((prev) =>
        prev.map((img, i) =>
          i === index ? { ...img, deficiency_check_procedure: value } : img,
        ),
      );

      onImagesChange(
        images.map((img, i) =>
          i === index ? { ...img, deficiency_check_procedure: value } : img,
        ),
      );
    },
    [isFrontcover, images, onImagesChange],
  );

  const handleDeficiencyRecommendationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const index = parseInt(e.target.name.split("-")[1], 10);

      if (isFrontcover) return;

      const { value } = e.target;

      setLocalImages((prev) =>
        prev.map((img, i) =>
          i === index ? { ...img, deficiency_recommendation: value } : img,
        ),
      );

      onImagesChange(
        images.map((img, i) =>
          i === index ? { ...img, deficiency_recommendation: value } : img,
        ),
      );
    },
    [isFrontcover, images, onImagesChange],
  );

  const addImageField = useCallback(() => {
    if (
      (isFrontcover && localImages.length === 0) ||
      (!isFrontcover &&
        (maxImages === undefined || localImages.length < maxImages))
    ) {
      const availableIndex = findFirstAvailableIndex();

      setLocalImages((prev) => [
        ...prev,
        {
          file: null,
          label: isFrontcover ? "Front Cover" : "",
          imgIndex: availableIndex,
          deficiency_check_procedure: "",
          deficiency_recommendation: "",
        },
      ]);
    }
  }, [isFrontcover, localImages.length, maxImages, findFirstAvailableIndex]);

  const removeImageField = useCallback(
    async (index: number) => {
      const imageToRemove = images.find((img) => img.imgIndex === index);

      if (imageToRemove) {
        await fetch(
          `/api/azure-report-images/delete?subdir=${subdir}&azureId=${imageToRemove.azureId}`,
          {
            method: "DELETE",
          },
        );
        onImagesChange(images.filter((img) => img.imgIndex !== index));
      }
      const newImages = localImages.filter((img) => img.imgIndex !== index);

      setLocalImages(newImages);
    },
    [images, localImages, onImagesChange, subdir],
  );

  const handleReorder = useCallback(
    (newOrder: LocalImages[]) => {
      const reorderedLocal = newOrder.map((image, newIndex) => ({
        ...image,
        imgIndex: newIndex,
      }));

      setLocalImages(reorderedLocal);

      const reorderedParent = images
        .map((parentImage) => {
          const matchingLocal = reorderedLocal.find(
            (local) => local.url === parentImage.url,
          );

          return matchingLocal
            ? { ...parentImage, imgIndex: matchingLocal.imgIndex }
            : null;
        })
        .filter((img): img is TowerReportImage => img !== null)
        .sort((a, b) => a.imgIndex - b.imgIndex);

      onImagesChange(reorderedParent);
    },
    [images, onImagesChange],
  );

  const canAddMore = useMemo(
    () =>
      (isFrontcover && localImages.length === 0) ||
      (!isFrontcover &&
        (maxImages === undefined || localImages.length < maxImages)),
    [isFrontcover, localImages.length, maxImages],
  );

  return (
    <>
      <Reorder.Group
        axis="y"
        className="space-y-4"
        values={sortedLocalImages}
        onReorder={handleReorder}
      >
        {sortedLocalImages.map((image) => (
          <Reorder.Item
            key={image.url || `new-${image.imgIndex}`}
            className="touch-none"
            dragControls={dragControls}
            value={image}
          >
            <div className="flex items-center gap-2 bg-background p-2 rounded-lg">
              <div
                className="cursor-grab"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <Grip color="#4b5563" />
              </div>
              <div className="flex-1">
                {image.url ? (
                  <ImageRow
                    image={image}
                    isDeficiency={isDeficiency}
                    isFrontcover={isFrontcover}
                    removeImageField={removeImageField}
                  />
                ) : (
                  <FormInputRow
                    handleDeficiencyCheckProcedureChange={
                      handleDeficiencyCheckProcedureChange
                    }
                    handleDeficiencyRecommendationChange={
                      handleDeficiencyRecommendationChange
                    }
                    handleImageChange={handleImageChange}
                    handleLabelChange={handleLabelChange}
                    image={image}
                    isDeficiency={isDeficiency}
                    isFrontcover={isFrontcover}
                    labelOptions={labelOptions}
                    labelPlaceholder={labelPlaceholder}
                    removeImageField={removeImageField}
                  />
                )}
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      {canAddMore && (
        <AddButton label={newImageButtonName} onClick={addImageField} />
      )}
    </>
  );
};

export default memo(ImageUpload);
