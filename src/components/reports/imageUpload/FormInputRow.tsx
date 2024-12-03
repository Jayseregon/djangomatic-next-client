import React, { useState } from "react";

import {
  LabelInput,
  FormInput,
  TrashButton,
} from "@/src/components/ui/formInput";
import { cn } from "@/src/lib/utils";
import { FormInputRowProps } from "@/src/interfaces/reports";
import { DropArea } from "@/components/reports/DropArea";

import { ImageRotateModal } from "./ImageRotateModal";

export const FormInputRow = ({
  image,
  isDeficiency,
  isFrontcover,
  labelOptions,
  labelPlaceholder,
  handleImageChange,
  handleLabelChange,
  handleDeficiencyCheckProcedureChange,
  handleDeficiencyRecommendationChange,
  removeImageField,
}: FormInputRowProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFilesAdded = (files: FileList) => {
    if (files && files[0]) {
      setSelectedFile(files[0]);
      setShowModal(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedFile(null);
  };

  const handleConfirmUpload = async (rotatedFile: File) => {
    const dataTransfer = new DataTransfer();

    dataTransfer.items.add(rotatedFile);
    handleImageChange(image.imgIndex, dataTransfer.files);
    setShowModal(false);
    setSelectedFile(null);
  };

  return (
    <>
      <div
        className={cn(
          isFrontcover
            ? "grid grid-cols-[1fr_auto] items-center min-w-[50vw] gap-4"
            : `grid ${isDeficiency ? "grid-cols-[1fr_1fr_1fr_1fr_auto]" : "grid-cols-[1fr_1fr_auto]"} min-w-full items-center gap-4`,
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
          onFilesAdded={handleFilesAdded}
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
      {selectedFile && (
        <ImageRotateModal
          file={selectedFile}
          isOpen={showModal}
          onClose={handleModalClose}
          onConfirm={handleConfirmUpload}
        />
      )}
    </>
  );
};
