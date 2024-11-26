import React, { useState, useEffect, useRef } from "react";
import { Reorder, useDragControls } from "motion/react";
import { Grip } from "lucide-react";

import { ImageUploadProps, LocalImages } from "@/src/interfaces/reports";
import { AddButton } from "@/src/components/ui/formInput";
import ImageRow from "./ImageRow";
import FormInputRow from "./FormInputRow";
import { TowerReportImage } from "@/types/reports";

export const ImageUpload: React.FC<ImageUploadProps> = ({
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
}) => {
  const [localImages, setLocalImages] = useState<LocalImages[]>([]);
  const isInitialized = useRef(false);
  const dragControls = useDragControls();

  useEffect(() => {
    if (!isInitialized.current && images.length > 0) {
      const initialLocalImages = images.map((image, index) => ({
        file: null,
        label: isFrontcover ? "Front Cover" : image.label,
        url: image.url,
        imgIndex: image.imgIndex ?? index,
        deficiency_check_procedure: image.deficiency_check_procedure,
        deficiency_recommendation: image.deficiency_recommendation,
      }));

      setLocalImages([...initialLocalImages]);
      isInitialized.current = true;
    }
  }, [images, isFrontcover]);

  const findFirstAvailableIndex = () => {
    const indices = localImages.map((image) => image.imgIndex);
    let index = 0;

    while (indices.includes(index)) {
      index++;
    }

    return index;
  };

  const handleImageChange = async (index: number, files: FileList) => {
    const newImages = [...localImages];

    if (files && files[0]) {
      const file = files[0];
      const label = isFrontcover ? "Front Cover" : newImages[index].label;
      const imgIndex = index;
      const deficiency_check_procedure = isDeficiency
        ? newImages[index].deficiency_check_procedure
        : "";
      const deficiency_recommendation = isDeficiency
        ? newImages[index].deficiency_recommendation
        : "";
      const { url, azureId, id } = await uploadImageToAzure(
        file,
        label,
        subdir
      );
      const newImage = {
        id,
        url,
        label,
        imgIndex,
        azureId,
        deficiency_check_procedure,
        deficiency_recommendation,
        siteProjectId: null,
        frontProjectId: null,
        deficiencyProjectId: null,
      };

      onImagesChange([...images, newImage]);
      newImages[index] = { ...newImages[index], file, url, imgIndex };
      onNewImageUpload(newImage);
    }
    setLocalImages(newImages);
  };

  const handleLabelChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (isFrontcover) return;

    const { value } = e.target;
    const newImages = [...localImages];

    newImages[index] = {
      ...newImages[index],
      label: value,
    };
    setLocalImages(newImages);

    const updatedImages = images.map((img, i) =>
      i === index ? { ...img, label: value } : img
    );

    onImagesChange(updatedImages);
  };

  const handleDeficiencyCheckProcedureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const index = parseInt(e.target.name.split("-")[1], 10);

    if (isFrontcover) return;

    const { value } = e.target;
    const newImages = [...localImages];

    newImages[index] = {
      ...newImages[index],
      deficiency_check_procedure: value,
    };
    setLocalImages(newImages);

    const updatedImages = images.map((img, i) =>
      i === index ? { ...img, deficiency_check_procedure: value } : img
    );

    onImagesChange(updatedImages);
  };

  const handleDeficiencyRecommendationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const index = parseInt(e.target.name.split("-")[1], 10);

    if (isFrontcover) return;

    const { value } = e.target;
    const newImages = [...localImages];

    newImages[index] = {
      ...newImages[index],
      deficiency_recommendation: value,
    };
    setLocalImages(newImages);

    const updatedImages = images.map((img, i) =>
      i === index ? { ...img, deficiency_recommendation: value } : img
    );

    onImagesChange(updatedImages);
  };

  const addImageField = () => {
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
  };

  const removeImageField = async (index: number) => {
    const imageToRemove = images.find((img) => img.imgIndex === index);

    if (imageToRemove) {
      await fetch(
        `/api/azure-report-images/delete?subdir=${subdir}&azureId=${imageToRemove.azureId}`,
        {
          method: "DELETE",
        }
      );
      onImagesChange(images.filter((img) => img.imgIndex !== index));
    }
    const newImages = localImages.filter((img) => img.imgIndex !== index);

    setLocalImages(newImages);
  };

  const uploadImageToAzure = async (
    file: File,
    label: string,
    subdir: string
  ) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("label", label);
    formData.append("subdir", subdir);

    const response = await fetch("/api/azure-report-images/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    return { url: data.url, azureId: data.azureId, id: data.id };
  };

  const handleReorder = (newOrder: LocalImages[]) => {
    // Create new array with updated indices
    const reorderedLocal = newOrder.map((image, newIndex) => ({
      ...image,
      imgIndex: newIndex,
    }));

    setLocalImages(reorderedLocal);

    // Update parent state
    const reorderedParent = images
      .map((parentImage) => {
        const matchingLocal = reorderedLocal.find(
          (local) => local.url === parentImage.url
        );
        return matchingLocal
          ? { ...parentImage, imgIndex: matchingLocal.imgIndex }
          : null;
      })
      .filter((img): img is TowerReportImage => img !== null)
      .sort((a, b) => a.imgIndex - b.imgIndex);

    onImagesChange(reorderedParent);
  };

  return (
    <>
      <Reorder.Group
        axis="y"
        values={localImages.sort((a, b) => a.imgIndex - b.imgIndex)}
        onReorder={handleReorder}
        className="space-y-4">
        {localImages
          .sort((a, b) => a.imgIndex - b.imgIndex)
          .map((image) => (
            <Reorder.Item
              key={image.url || `new-${image.imgIndex}`}
              value={image}
              className="touch-none"
              dragControls={dragControls}>
              <div className="flex items-center gap-2 bg-background p-2 rounded-lg">
                <div
                  onPointerDown={(e) => dragControls.start(e)}
                  className="cursor-grab">
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
      {((isFrontcover && localImages.length === 0) ||
        (!isFrontcover &&
          (maxImages === undefined || localImages.length < maxImages))) && (
        <AddButton
          label={newImageButtonName}
          onClick={addImageField}
        />
      )}
    </>
  );
};

export default ImageUpload;
