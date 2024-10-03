import React from "react";

import { AntennaTransmissionInputsProps } from "@/src/interfaces/reports";
import { AntennaTransmissionLine } from "@/src/types/reports";

import { FormInput, TrashButton, AddButtom } from "../ui/formInput";

const inputsList: {
  [key: string]: {
    label?: string;
    field: keyof AntennaTransmissionLine;
    placeholder: string;
    type: string;
  };
} = {
  elevation: {
    label: "Elevation",
    field: "elevation",
    placeholder: "0.00",
    type: "number",
  },
  quantity: {
    label: "Quantity",
    field: "quantity",
    placeholder: "0",
    type: "number",
  },
  equipment: {
    label: "Equipment",
    field: "equipment",
    placeholder: "Equipment",
    type: "text",
  },
  azimuth: {
    label: "Azimuth",
    field: "azimuth",
    placeholder: "0.0",
    type: "number",
  },
  tx_line: {
    label: "TX Line",
    field: "tx_line",
    placeholder: "TX Line",
    type: "text",
  },
  odu: {
    label: "ODU",
    field: "odu",
    placeholder: "ODU",
    type: "text",
  },
  carrier: {
    label: "Carrier",
    field: "carrier",
    placeholder: "Carrier",
    type: "text",
  },
};

export default function AntennaTransmissionInputs({
  antennaInventory,
  onAntennaChange,
  onAddAntenna,
  onRemoveAntenna,
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
        <div className="grid grid-flow-col auto-cols-fr items-center mx-20 pe-10">
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

        {antennaInventory.map((antenna, index) => (
          <div key={index} className="grid grid-cols-[1fr_auto] mx-20">
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
            <div className="h-full w-fit content-end">
              <TrashButton onClick={() => onRemoveAntenna(index)} />
            </div>
          </div>
        ))}
      </div>
      <AddButtom label="Add New Inventory" onClick={onAddAntenna} />
    </>
  );
}
