import React, { memo } from "react";

import { AntennaTransmissionInputsProps } from "@/src/interfaces/reports";
import { AntennaTransmissionLine } from "@/src/interfaces/reports";
import {
  AntennaFormInput,
  TrashButton,
  AddButton,
  CopyButton,
} from "@/components/ui/formInput";

const inputsList: {
  [key: string]: {
    label?: string;
    field: keyof AntennaTransmissionLine;
    placeholder: string;
    width: string;
    withTooltip?: boolean;
  };
} = {
  elevation: {
    label: "Elevation",
    field: "elevation",
    placeholder: "0.0",
    width: "w-20",
    withTooltip: false,
  },
  quantity: {
    label: "Quantity",
    field: "quantity",
    placeholder: "0",
    width: "w-20",
    withTooltip: false,
  },
  equipment: {
    label: "Equipment",
    field: "equipment",
    placeholder: "Equipment",
    width: "w-full",
    withTooltip: true,
  },
  azimuth: {
    label: "Azimuth",
    field: "azimuth",
    placeholder: "0",
    width: "w-20",
    withTooltip: false,
  },
  tx_line: {
    label: "TX Line",
    field: "tx_line",
    placeholder: "TX Line",
    width: "w-full",
    withTooltip: true,
  },
  odu: {
    label: "ODU",
    field: "odu",
    placeholder: "ODU",
    width: "w-full",
    withTooltip: true,
  },
  carrier: {
    label: "Carrier",
    field: "carrier",
    placeholder: "Carrier",
    width: "w-32",
    withTooltip: false,
  },
};

const AntennaTransmissionInputs = ({
  antennaInventory,
  onAntennaChange,
  onAddAntenna,
  onRemoveAntenna,
  onDuplicateAntenna,
}: AntennaTransmissionInputsProps) => {
  const handleChange = (
    index: number,
    field: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;

    onAntennaChange(index, field, value);
  };

  const inputKeys = Object.keys(inputsList);

  // Map input widths to fixed sizes or fractions
  const gridTemplateColumns = inputKeys
    .map((key) => {
      const widthClass = inputsList[key].width;

      switch (widthClass) {
        case "w-20":
          return "4rem";
        case "w-32":
          return "8rem";
        case "w-full":
          return "1fr";
        default:
          return "auto";
      }
    })
    .join(" ");

  return (
    <div className="space-y-10">
      <div className="items-end space-y-5">
        {antennaInventory.length > 0 && (
          <div
            className="grid items-center gap-1 pe-[5.5rem]"
            style={{ gridTemplateColumns }}
          >
            {inputKeys.map((k, i) => {
              const inputConfig = inputsList[k];

              return (
                <div key={i} className="text-center text-sm text-primary">
                  {inputConfig.label}
                </div>
              );
            })}
          </div>
        )}

        {antennaInventory.map((antenna, index) => (
          <div
            key={index}
            className="grid items-center gap-1"
            style={{ gridTemplateColumns: `${gridTemplateColumns} auto` }}
          >
            {inputKeys.map((key) => {
              const inputConfig = inputsList[key];

              return (
                <AntennaFormInput
                  key={inputConfig.field}
                  name={inputConfig.field}
                  placeholder={inputConfig.placeholder}
                  value={antenna[inputConfig.field]}
                  onChange={(e) => handleChange(index, inputConfig.field, e)}
                />
              );
            })}
            <div className="flex">
              <CopyButton onClick={() => onDuplicateAntenna(index)} />
              <TrashButton onClick={() => onRemoveAntenna(index)} />
            </div>
          </div>
        ))}
      </div>
      <AddButton label="Add New Inventory" onClick={onAddAntenna} />
    </div>
  );
};

export default memo(AntennaTransmissionInputs);
