import React, { useState, useEffect, useRef } from "react";

import { cn } from "@/src/lib/utils";
import { ImageUploadProps, LocalImages } from "@/src/interfaces/reports";
import {
  LabelInput,
  DisplayInput,
  TrashButton,
  AddButton,
  FormInput,
  DisplayInputWithTooltip,
} from "@/src/components/ui/formInput";
import { DropArea } from "@/src/components/reports/DropArea";

export default function ImageUpload({
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
}: ImageUploadProps) {
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

  return (
    <>
      {isDeficiency && localImages.length > 0 ? (
        <div className="grid grid-flow-col justify-between overflow-hidden ms-[30%] me-[25%]">
          <div className="text-nowrap text-ellipsis text-sm text-primary overflow-hidden w-fit">
            Deficiency
          </div>
          <div className="text-nowrap text-ellipsis text-sm text-primary overflow-hidden w-fit ps-[15%]">
            Checking Procedure
          </div>
          <div className="text-nowrap text-ellipsis text-sm text-primary overflow-hidden w-fit">
            Recommendation
          </div>
        </div>
      ) : (
        ""
      )}
      {localImages
        .sort((a, b) => a.imgIndex - b.imgIndex)
        .map((image, index) => (
          <div
            key={index}
            className={`flex items-center justify-center mx-20 ${isFrontcover ?? "space-x-4"}`}
          >
            {image.url ? (
              <>
                <img
                  alt={image.label}
                  className="size-20 object-cover rounded-lg"
                  src={image.url}
                />
                {!isFrontcover ? (
                  isDeficiency ? (
                    <>
                      <DisplayInputWithTooltip
                        value={image.imgIndex + 1 + ". " + image.label}
                        width="w-1/3"
                      />
                      <DisplayInput
                        value={image.deficiency_check_procedure}
                        width="w-1/3 max-w-20"
                      />
                      <DisplayInputWithTooltip
                        value={image.deficiency_recommendation}
                        width="w-1/3"
                      />
                      <TrashButton
                        className="ml-2"
                        onClick={() => removeImageField(image.imgIndex)}
                      />
                    </>
                  ) : (
                    <>
                      <DisplayInput
                        value={image.imgIndex + 1 + ". " + image.label}
                      />
                      <TrashButton
                        className="ml-2"
                        onClick={() => removeImageField(image.imgIndex)}
                      />
                    </>
                  )
                ) : (
                  <TrashButton
                    className="ml-2"
                    onClick={() => removeImageField(image.imgIndex)}
                  />
                )}
              </>
            ) : (
              <div
                className={cn(
                  isDeficiency
                    ? "grid grid-cols-[auto_1fr_1fr_1fr_auto] min-w-full items-center gap-4"
                    : isFrontcover
                      ? "grid grid-cols-[1fr_auto] items-center min-w-[50vw] px-20 gap-4"
                      : "grid grid-cols-[1fr_1fr_auto] min-w-full px-20 items-center gap-4",
                )}
              >
                <DropArea
                  index={image.imgIndex}
                  isDisabled={
                    isDeficiency
                      ? !(
                          image.label &&
                          image.deficiency_check_procedure &&
                          image.deficiency_recommendation
                        )
                      : !image.label
                  }
                  onFilesAdded={(files) =>
                    handleImageChange(image.imgIndex, files)
                  }
                />
                {!isFrontcover ? (
                  isDeficiency ? (
                    <>
                      <LabelInput
                        name={`label-${image.imgIndex}`}
                        options={labelOptions || []}
                        placeholder={labelPlaceholder}
                        value={image.label}
                        onChange={(e) => handleLabelChange(image.imgIndex, e)}
                      />
                      <FormInput
                        name={`deficiency_check_procedure-${image.imgIndex}`}
                        placeholder="Checking Procedure"
                        value={image.deficiency_check_procedure}
                        onChange={handleDeficiencyCheckProcedureChange}
                      />
                      <FormInput
                        name={`deficiency_recommendation-${image.imgIndex}`}
                        placeholder="Recommendation"
                        value={image.deficiency_recommendation}
                        onChange={handleDeficiencyRecommendationChange}
                      />
                    </>
                  ) : (
                    <LabelInput
                      name={`label-${image.imgIndex}`}
                      options={labelOptions || []}
                      placeholder={labelPlaceholder}
                      value={image.label}
                      onChange={(e) => handleLabelChange(image.imgIndex, e)}
                    />
                  )
                ) : (
                  <></>
                )}
                <TrashButton onClick={() => removeImageField(image.imgIndex)} />
              </div>
            )}
          </div>
        ))}
      {((isFrontcover && localImages.length === 0) ||
        (!isFrontcover &&
          (maxImages === undefined || localImages.length < maxImages))) && (
        <AddButton label={newImageButtonName} onClick={addImageField} />
      )}
    </>
  );
}
