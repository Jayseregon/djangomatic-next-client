import { renderHook, act } from "@testing-library/react";

import { useAntennaInventory } from "@/hooks/useAntennaInventory";
import { AntennaTransmissionLine } from "@/interfaces/reports";

describe("useAntennaInventory", () => {
  const mockInitialInventory: AntennaTransmissionLine[] = [
    {
      id: "1",
      elevation: "100",
      quantity: "2",
      equipment: "Test Equipment",
      azimuth: "180",
      tx_line: "Line1",
      odu: "ODU1",
      carrier: "Carrier1",
      projectId: "",
    },
  ];

  it("should initialize with empty array when no initial inventory is provided", () => {
    const { result } = renderHook(() => useAntennaInventory());

    expect(result.current.inventory).toEqual([]);
  });

  it("should initialize with provided initial inventory", () => {
    const { result } = renderHook(() =>
      useAntennaInventory(mockInitialInventory),
    );

    expect(result.current.inventory).toEqual(mockInitialInventory);
  });

  it("should handle field changes correctly", () => {
    const { result } = renderHook(() =>
      useAntennaInventory(mockInitialInventory),
    );

    act(() => {
      result.current.handleChange(0, "elevation", "200");
    });

    expect(result.current.inventory[0].elevation).toBe("200");
  });

  it("should add new antenna correctly", () => {
    const { result } = renderHook(() =>
      useAntennaInventory(mockInitialInventory),
    );
    const initialLength = result.current.inventory.length;

    act(() => {
      result.current.addAntenna();
    });

    expect(result.current.inventory.length).toBe(initialLength + 1);
    expect(result.current.inventory[initialLength]).toEqual({
      id: "",
      elevation: "",
      quantity: "",
      equipment: "",
      azimuth: "",
      tx_line: "",
      odu: "",
      carrier: "",
      projectId: "",
    });
  });

  it("should remove antenna correctly", () => {
    const { result } = renderHook(() =>
      useAntennaInventory(mockInitialInventory),
    );
    const initialLength = result.current.inventory.length;

    act(() => {
      result.current.removeAntenna(0);
    });

    expect(result.current.inventory.length).toBe(initialLength - 1);
    expect(result.current.inventory).not.toContainEqual(
      mockInitialInventory[0],
    );
  });

  it("should duplicate antenna correctly", () => {
    const { result } = renderHook(() =>
      useAntennaInventory(mockInitialInventory),
    );
    const initialLength = result.current.inventory.length;

    act(() => {
      result.current.duplicateAntenna(0);
    });

    expect(result.current.inventory.length).toBe(initialLength + 1);
    expect(result.current.inventory[1]).toEqual(mockInitialInventory[0]);
  });

  it("should set inventory directly using setInventory", () => {
    const { result } = renderHook(() => useAntennaInventory());

    act(() => {
      result.current.setInventory(mockInitialInventory);
    });

    expect(result.current.inventory).toEqual(mockInitialInventory);
  });

  it("should handle multiple operations in sequence", () => {
    const { result } = renderHook(() =>
      useAntennaInventory(mockInitialInventory),
    );

    act(() => {
      result.current.addAntenna();
      result.current.handleChange(1, "elevation", "300");
      result.current.duplicateAntenna(1);
    });

    expect(result.current.inventory.length).toBe(3);
    expect(result.current.inventory[1].elevation).toBe("300");
    expect(result.current.inventory[2].elevation).toBe("300");
  });

  it("should preserve other fields when updating a specific field", () => {
    const { result } = renderHook(() =>
      useAntennaInventory(mockInitialInventory),
    );
    const originalAntenna = { ...result.current.inventory[0] };

    act(() => {
      result.current.handleChange(0, "elevation", "250");
    });

    const updatedAntenna = result.current.inventory[0];

    expect(updatedAntenna.elevation).toBe("250");
    expect(updatedAntenna.equipment).toBe(originalAntenna.equipment);
    expect(updatedAntenna.azimuth).toBe(originalAntenna.azimuth);
  });
});
