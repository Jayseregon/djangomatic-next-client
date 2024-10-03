import React, { useState, useEffect, useRef } from "react";

import { cn } from "@/src/lib/utils";
import { ImageUploadProps } from "@/src/interfaces/reports";

import {
  LabelInput,
  DisplayInput,
  TrashButton,
  AddButtom,
} from "../ui/formInput";

import { DropArea } from "./DropArea";

export default function ImageUpload({
  images,
  onImagesChange,
  subdir,
  onNewImageUpload,
  newImageButtonName,
  labelOptions,
  maxImages,
  isFrontcover,
}: ImageUploadProps) {
  const [localImages, setLocalImages] = useState<
    { file: File | null; label: string; url?: string; imgIndex: number }[]
  >([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Initialize localImages state based on the images prop only once
    if (!isInitialized.current && images.length > 0) {
      const initialLocalImages = images.map((image, index) => ({
        file: null,
        label: isFrontcover ? "Front Cover" : image.label,
        url: image.url,
        imgIndex: image.imgIndex ?? index, // Use imgIndex if available, otherwise use index
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
      const imgIndex = index; // Use the index as imgIndex
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
    if (isFrontcover) return; // Prevent label change if it's a front cover

    const { value } = e.target;
    const newImages = [...localImages];

    // Update the label with the new value
    newImages[index] = {
      ...newImages[index],
      label: value,
    };
    setLocalImages(newImages);

    // Update the label in the images prop
    const updatedImages = images.map((img, i) =>
      i === index ? { ...img, label: value } : img,
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

  return (
    <>
      {localImages
        .sort((a, b) => a.imgIndex - b.imgIndex)
        .map((image, index) => (
          <div
            key={index}
            className={`flex items-center justify-center ${
              isFrontcover ?? "space-x-4"
            }`}
          >
            {image.url ? (
              <>
                <img
                  alt={image.label}
                  className="size-20 object-cover rounded-lg"
                  src={image.url}
                />
                {!isFrontcover && (
                  <DisplayInput
                    value={image.imgIndex + 1 + ". " + image.label}
                  />
                )}
                <TrashButton
                  className="ml-2"
                  onClick={() => removeImageField(image.imgIndex)}
                />
              </>
            ) : (
              <div
                className={cn(
                  isFrontcover
                    ? "grid grid-cols-[1fr_auto] items-center min-w-[50vw] px-20 gap-4"
                    : "grid grid-cols-[1fr_1fr_auto] min-w-full px-20 items-center gap-4",
                )}
              >
                <DropArea
                  index={image.imgIndex}
                  isDisabled={!image.label}
                  onFilesAdded={(files) =>
                    handleImageChange(image.imgIndex, files)
                  }
                />
                {!isFrontcover && (
                  <LabelInput
                    name={`label-${image.imgIndex}`}
                    options={labelOptions || []}
                    placeholder="Select a label"
                    value={image.label}
                    onChange={(e) => handleLabelChange(image.imgIndex, e)}
                  />
                )}
                <TrashButton onClick={() => removeImageField(image.imgIndex)} />
              </div>
            )}
          </div>
        ))}
      {((isFrontcover && localImages.length === 0) ||
        (!isFrontcover &&
          (maxImages === undefined || localImages.length < maxImages))) && (
        <AddButtom
          label={`Add ${newImageButtonName} Image`}
          onClick={addImageField}
        />
      )}
    </>
  );
}
