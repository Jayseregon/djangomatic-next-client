import React from "react";

import {
  LabelInput,
  FormInput,
  TrashButton,
} from "@/src/components/ui/formInput";
import { cn } from "@/src/lib/utils";
import { FormInputRowProps } from "@/src/interfaces/reports";

import { DropArea } from "../DropArea";

const FormInputRow: React.FC<FormInputRowProps> = ({
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
}) => (
  <div
    className={cn(
      isFrontcover
        ? "grid grid-cols-[1fr_auto] items-center min-w-[50vw] px-20 gap-4"
        : `grid ${isDeficiency ? "grid-cols-[1fr_1fr_1fr_1fr_auto]" : "grid-cols-[1fr_1fr_auto]"} min-w-full px-20 items-center gap-4`,
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
      onFilesAdded={(files) => handleImageChange(image.imgIndex, files)}
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
);

export default FormInputRow;
