import { useState, useCallback } from "react";

import { AntennaTransmissionLine } from "@/interfaces/reports";

export const useAntennaInventory = (
  initialInventory: AntennaTransmissionLine[] = [],
) => {
  const [inventory, setInventory] =
    useState<AntennaTransmissionLine[]>(initialInventory);

  const handleChange = useCallback(
    (index: number, field: string, value: string) => {
      setInventory((prev) => {
        const updatedInventory = [...prev];

        updatedInventory[index] = {
          ...updatedInventory[index],
          [field]: value,
        };

        return updatedInventory;
      });
    },
    [],
  );

  const addAntenna = useCallback(() => {
    setInventory((prev) => [
      ...prev,
      {
        id: "",
        elevation: "",
        quantity: "",
        equipment: "",
        azimuth: "",
        tx_line: "",
        odu: "",
        carrier: "",
        projectId: "",
      },
    ]);
  }, []);

  const removeAntenna = useCallback((index: number) => {
    setInventory((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const duplicateAntenna = useCallback((index: number) => {
    setInventory((prev) => {
      const antennaToDuplicate = prev[index];

      return [
        ...prev.slice(0, index + 1),
        { ...antennaToDuplicate },
        ...prev.slice(index + 1),
      ];
    });
  }, []);

  return {
    inventory,
    setInventory,
    handleChange,
    addAntenna,
    removeAntenna,
    duplicateAntenna,
  };
};
