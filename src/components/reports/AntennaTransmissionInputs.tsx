import React from "react";
import { Button } from "@nextui-org/react";
import { FormInput, TrashButton } from "../ui/formInput";
import { AntennaTransmissionInputsProps } from "@/src/interfaces/reports";
import { AntennaTransmissionLine } from "@/src/types/reports";

const inputsList: {
  [key: string]: {
    label?: string;
    field: keyof AntennaTransmissionLine;
    placeholder: string;
    type: string;
  };
} = {
  elevation: {
    // label: "Elevation",
    field: "elevation",
    placeholder: "0.00",
    type: "number",
  },
  quantity: {
    // label: "Quantity",
    field: "quantity",
    placeholder: "0",
    type: "number",
  },
  equipment: {
    // label: "Equipment",
    field: "equipment",
    placeholder: "Equipment",
    type: "text",
  },
  azimuth: {
    // label: "Azimuth",
    field: "azimuth",
    placeholder: "0.0",
    type: "number",
  },
  tx_line: {
    // label: "TX Line",
    field: "tx_line",
    placeholder: "TX Line",
    type: "text",
  },
  odu: {
    // label: "ODU",
    field: "odu",
    placeholder: "ODU",
    type: "text",
  },
  carrier: {
    // label: "Carrier",
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
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    let parsedValue: string | number = value;

    if (type === "number") {
      parsedValue = value === "" ? "" : parseFloat(value);
    }

    onAntennaChange(index, field, parsedValue);
  };

  return (
    <div className="items-end">
      {antennaInventory.map((antenna, index) => (
        <div key={index} className="grid grid-cols-[1fr_auto] mx-20">
          <div
            key={index}
            className="grid grid-flow-col auto-cols-fr items-center items-end">
            {Object.keys(inputsList).map((key) => {
              const inputConfig = inputsList[key];
              return (
                <FormInput
                  key={inputConfig.field}
                  label={inputConfig.label}
                  name={inputConfig.field}
                  placeholder={inputConfig.placeholder}
                  isRounded={false}
                  type={inputConfig.type}
                  value={antenna[inputConfig.field]}
                  onChange={(e) =>
                    handleChange(index, inputConfig.field, inputConfig.type, e)
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
      <Button
      className="mt-4"
        color="primary"
        onClick={onAddAntenna}>
        Add Antenna
      </Button>
    </div>
  );
}
