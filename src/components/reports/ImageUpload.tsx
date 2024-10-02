import React, { useState, useEffect, useRef } from "react";
import { Button } from "@nextui-org/react";

import { cn } from "@/src/lib/utils";
import { ImageUploadProps } from "@/src/interfaces/reports";

import { TrashIcon, AddImageIcon } from "../icons";
import { LabelInput, DisplayInput } from "../ui/formInput";

export const ImageUpload = ({
  images,
  onImagesChange,
  subdir,
  onNewImageUpload,
  newImageButtonName,
  labelOptions,
  maxImages,
  isFrontcover,
}: ImageUploadProps) => {
  const [localImages, setLocalImages] = useState<
    { file: File | null; label: string; url?: string }[]
  >([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Initialize localImages state based on the images prop only once
    if (!isInitialized.current && images.length > 0) {
      const initialLocalImages = images.map((image) => ({
        file: null,
        label: isFrontcover ? "Front Cover" : image.label,
        url: image.url,
      }));

      setLocalImages([...initialLocalImages]);
      isInitialized.current = true;
    }
  }, [images, isFrontcover]);

  const handleImageChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { files } = e.target;
    const newImages = [...localImages];

    if (files && files[0]) {
      const file = files[0];
      const label = isFrontcover ? "Front Cover" : newImages[index].label;
      const { url, azureId, id } = await uploadImageToAzure(
        file,
        label,
        subdir,
      );
      const newImage = {
        id,
        url,
        label,
        azureId,
        siteProjectId: null,
        frontProjectId: null,
        deficiencyProjectId: null,
      };

      onImagesChange([...images, newImage]);
      newImages[index] = { ...newImages[index], file, url };
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

    // Remove any existing index prefix
    const prefix = `${index + 1}. `;
    const newValue = value.startsWith(prefix)
      ? value.slice(prefix.length)
      : value;

    // Update the label with the new value and prefix
    newImages[index] = {
      ...newImages[index],
      label: `${index + 1}. ${newValue}`,
    };
    setLocalImages(newImages);

    // Update the label in the images prop
    const updatedImages = images.map((img, i) =>
      i === index ? { ...img, label: `${index + 1}. ${newValue}` } : img,
    );

    onImagesChange(updatedImages);
  };

  const addImageField = () => {
    if (
      (isFrontcover && localImages.length === 0) ||
      (!isFrontcover &&
        (maxImages === undefined || localImages.length < maxImages))
    ) {
      setLocalImages((prev) => [
        ...prev,
        { file: null, label: isFrontcover ? "Front Cover" : "" },
      ]);
    }
  };

  const removeImageField = async (index: number) => {
    const imageToRemove = images[index];

    if (imageToRemove) {
      await fetch(
        `/api/azure-report-images/delete?subdir=${subdir}&azureId=${imageToRemove.azureId}`,
        {
          method: "DELETE",
        },
      );
      onImagesChange(images.filter((_, i) => i !== index));
    }
    const newImages = localImages.filter((_, i) => i !== index);

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
      {localImages.map((image, index) => (
        <div key={index} className="flex items-center justify-center space-x-4">
          {image.url ? (
            <>
              <img
                alt={image.label}
                className="size-20 object-cover rounded-lg me-4"
                src={image.url}
              />
              <DisplayInput value={image.label} />
              <Button
                isIconOnly
                className="ml-2"
                color="danger"
                radius="full"
                variant="bordered"
                onClick={() => removeImageField(index)}
              >
                <TrashIcon />
              </Button>
            </>
          ) : (
            <div
              className={cn(
                isFrontcover
                  ? "grid grid-cols-[1fr_auto] items-center min-w-[50vw] px-20 gap-4"
                  : "grid grid-cols-[1fr_1fr_auto] min-w-full px-20 items-center gap-4",
              )}
            >
              <input
                aria-label={`file-input-${index}`}
                className="sr-only"
                id={`file-input-${index}`}
                name={`file-input-${index}`}
                type="file"
                onChange={(e) => handleImageChange(index, e)}
              />
              <div className="grid grid-cols-1 gap-1">
                <Button
                  isIconOnly
                  className="bg-primary text-white w-full h-10 my-3"
                  isDisabled={!image.label}
                  radius="full"
                  variant="solid"
                  onClick={() => {
                    const fileInput = document.getElementById(
                      `file-input-${index}`,
                    );

                    if (fileInput) {
                      (fileInput as HTMLInputElement).click();
                    }
                  }}
                >
                  <AddImageIcon />
                </Button>
              </div>
              {!isFrontcover && (
                <LabelInput
                  name={`label-${index}`}
                  options={labelOptions || []}
                  placeholder="Select a label"
                  value={image.label}
                  onChange={(e) => handleLabelChange(index, e)}
                />
              )}
              <Button
                isIconOnly
                color="danger"
                radius="full"
                variant="bordered"
                onClick={() => removeImageField(index)}
              >
                <TrashIcon />
              </Button>
            </div>
          )}
        </div>
      ))}
      {((isFrontcover && localImages.length === 0) ||
        (!isFrontcover &&
          (maxImages === undefined || localImages.length < maxImages))) && (
        <Button
          className="mt-4 max-w-[30vw] mx-auto border-indigo-700 dark:border-indigo-300 text-indigo-700 dark:text-indigo-300"
          radius="lg"
          type="button"
          variant="ghost"
          onClick={addImageField}
        >
          {`Add ${newImageButtonName} Image`}
        </Button>
      )}
    </>
  );
};
