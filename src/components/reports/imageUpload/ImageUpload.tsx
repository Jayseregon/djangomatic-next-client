import React, { useState, useEffect, useRef } from "react";

import { ImageUploadProps, LocalImages } from "@/src/interfaces/reports";
import { AddButtom } from "@/src/components/ui/formInput";

import Header from "./Header";
import ImageRow from "./ImageRow";
import FormInputRow from "./FormInputRow";

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
        subdir,
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
    e: React.ChangeEvent<HTMLInputElement>,
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
      i === index ? { ...img, label: value } : img,
    );

    onImagesChange(updatedImages);
  };

  const handleDeficiencyCheckProcedureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
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
      i === index ? { ...img, deficiency_check_procedure: value } : img,
    );

    onImagesChange(updatedImages);
  };

  const handleDeficiencyRecommendationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
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
      i === index ? { ...img, deficiency_recommendation: value } : img,
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
        },
      );
      onImagesChange(images.filter((img) => img.imgIndex !== index));
    }
    const newImages = localImages.filter((img) => img.imgIndex !== index);

    setLocalImages(newImages);
  };

  const uploadImageToAzure = async (
    file: File,
    label: string,
    subdir: string,
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", e.currentTarget.dataset.index!);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData("text/plain");
    const targetIndex = e.currentTarget.dataset.index;

    if (draggedIndex !== targetIndex) {
      const reorderedImages = [...localImages];
      const [draggedImage] = reorderedImages.splice(Number(draggedIndex), 1);

      reorderedImages.splice(Number(targetIndex), 0, draggedImage);

      // Update imgIndex for each image
      const updatedImages = reorderedImages.map((image, index) => ({
        ...image,
        imgIndex: index,
        id: images[index]?.id ?? null,
        azureId: images[index]?.azureId ?? null,
        url: image.url ?? "",
      }));

      setLocalImages(updatedImages);
      onImagesChange(updatedImages);
    }
  };

  return (
    <>
      {isDeficiency && localImages.length > 0 && <Header />}
      {localImages
        .sort((a, b) => a.imgIndex - b.imgIndex)
        .map((image, index) =>
          image.url ? (
            <div
              key={index}
              draggable
              data-index={index}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            >
              <ImageRow
                image={image}
                isDeficiency={isDeficiency}
                isFrontcover={isFrontcover}
                removeImageField={removeImageField}
              />
            </div>
          ) : (
            <div
              key={index}
              draggable
              data-index={index}
              onDragOver={handleDragOver}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            >
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
            </div>
          ),
        )}
      {((isFrontcover && localImages.length === 0) ||
        (!isFrontcover &&
          (maxImages === undefined || localImages.length < maxImages))) && (
        <AddButtom label={newImageButtonName} onClick={addImageField} />
      )}
    </>
  );
};

export default ImageUpload;
