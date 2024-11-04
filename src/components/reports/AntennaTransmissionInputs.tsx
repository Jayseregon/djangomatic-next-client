import React from "react";

import { AntennaTransmissionInputsProps } from "@/src/interfaces/reports";
import { AntennaTransmissionLine } from "@/src/types/reports";
import {
  FormInput,
  TrashButton,
  AddButtom,
  CopyButton,
} from "@/components/ui/formInput";

const inputsList: {
  [key: string]: {
    label?: string;
    field: keyof AntennaTransmissionLine;
    placeholder: string;
    type: string;
    withTooltip?: boolean;
  };
} = {
  elevation: {
    label: "Elevation",
    field: "elevation",
    placeholder: "0.00",
    type: "number",
    withTooltip: false,
  },
  quantity: {
    label: "Quantity",
    field: "quantity",
    placeholder: "0",
    type: "number",
    withTooltip: false,
  },
  equipment: {
    label: "Equipment",
    field: "equipment",
    placeholder: "Equipment",
    type: "text",
    withTooltip: true,
  },
  azimuth: {
    label: "Azimuth",
    field: "azimuth",
    placeholder: "0.0",
    type: "number",
    withTooltip: false,
  },
  tx_line: {
    label: "TX Line",
    field: "tx_line",
    placeholder: "TX Line",
    type: "text",
    withTooltip: true,
  },
  odu: {
    label: "ODU",
    field: "odu",
    placeholder: "ODU",
    type: "text",
    withTooltip: true,
  },
  carrier: {
    label: "Carrier",
    field: "carrier",
    placeholder: "Carrier",
    type: "text",
    withTooltip: false,
  },
};

export default function AntennaTransmissionInputs({
  antennaInventory,
  onAntennaChange,
  onAddAntenna,
  onRemoveAntenna,
  onDuplicateAntenna, // Added this line
}: AntennaTransmissionInputsProps) {
  const handleChange = (
    index: number,
    field: string,
    type: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;
    let parsedValue: string | number = value;

    if (type === "number") {
      parsedValue = value === "" ? "" : parseFloat(value);
    }

    onAntennaChange(index, field, parsedValue);
  };

  return (
    <>
      <div className="items-end space-y-2">
        {antennaInventory.length > 0 ? (
          <div className="grid grid-flow-col auto-cols-fr items-center pe-20">
            {Object.keys(inputsList).map((k, i) => {
              return (
                <div
                  key={i}
                  className="text-nowrap text-ellipsis text-sm text-primary overflow-hidden"
                >
                  {inputsList[k].label}
                </div>
              );
            })}
          </div>
        ) : (
          <></>
        )}

        {antennaInventory.map((antenna, index) => (
          <div key={index} className="grid grid-cols-[1fr_auto] ">
            <div
              key={index}
              className="grid grid-flow-col auto-cols-fr items-center gap-1 items-end"
            >
              {Object.keys(inputsList).map((key) => {
                const inputConfig = inputsList[key];

                return (
                  <FormInput
                    key={inputConfig.field}
                    name={inputConfig.field}
                    placeholder={inputConfig.placeholder}
                    type={inputConfig.type}
                    value={antenna[inputConfig.field]}
                    withTooltip={inputConfig.withTooltip}
                    onChange={(e) =>
                      handleChange(
                        index,
                        inputConfig.field,
                        inputConfig.type,
                        e,
                      )
                    }
                  />
                );
              })}
            </div>
            <div className="h-full w-fit content-end flex">
              <CopyButton onClick={() => onDuplicateAntenna(index)} />
              <TrashButton onClick={() => onRemoveAntenna(index)} />
            </div>
          </div>
        ))}
      </div>
      <AddButtom label="Add New Inventory" onClick={onAddAntenna} />
    </>
  );
}
