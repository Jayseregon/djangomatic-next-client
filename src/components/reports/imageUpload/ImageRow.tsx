import React from "react";

import {
  DisplayInput,
  DisplayInputWithTooltip,
  TrashButton,
} from "@/src/components/ui/formInput";
import { ImageRowProps } from "@/src/interfaces/reports";

export const ImageRow = ({
  image,
  isDeficiency,
  isFrontcover,
  removeImageField,
}: ImageRowProps) => (
  <div
    className={`flex items-center justify-center  ${isFrontcover ?? "space-x-4"}`}
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
            <div className="flex items-center space-x-2">
              <DisplayInputWithTooltip
                value={image.imgIndex + 1 + ". " + image.label}
                width="flex-1"
              />
              <DisplayInput
                value={image.deficiency_check_procedure}
                width="w-20"
              />
              <DisplayInputWithTooltip
                value={image.deficiency_recommendation}
                width="flex-1"
              />
              <TrashButton
                className="ml-2"
                onClick={() => removeImageField(image.imgIndex)}
              />
            </div>
          ) : (
            <>
              <DisplayInput
                value={image.imgIndex + 1 + ". " + image.label}
                width="w-full"
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
      <></>
    )}
  </div>
);
