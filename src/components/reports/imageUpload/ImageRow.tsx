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
