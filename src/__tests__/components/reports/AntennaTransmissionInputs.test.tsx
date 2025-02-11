import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import AntennaTransmissionInputs from "@/src/components/reports/AntennaTransmissionInputs";
import { AntennaTransmissionLine } from "@/src/interfaces/reports";

describe("AntennaTransmissionInputs", () => {
  const mockAntenna: AntennaTransmissionLine = {
    id: "1",
    elevation: "10.0",
    equipment: "Test Equipment",
    quantity: "2",
    azimuth: "180",
    tx_line: "Test TX Line",
    odu: "Test ODU",
    carrier: "Test Carrier",
    projectId: "123",
  };

  const defaultProps = {
    antennaInventory: [mockAntenna],
    onAntennaChange: jest.fn(),
    onAddAntenna: jest.fn(),
    onRemoveAntenna: jest.fn(),
    onDuplicateAntenna: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<AntennaTransmissionInputs {...defaultProps} />);
    expect(screen.getByText("Elevation")).toBeInTheDocument();
    expect(screen.getByText("Equipment")).toBeInTheDocument();
  });

  it("displays all input fields for each antenna", () => {
    render(<AntennaTransmissionInputs {...defaultProps} />);

    expect(screen.getByDisplayValue("10.0")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Equipment")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2")).toBeInTheDocument();
    expect(screen.getByDisplayValue("180")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test TX Line")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test ODU")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Carrier")).toBeInTheDocument();
  });

  it("calls onAddAntenna when add button is clicked", () => {
    render(<AntennaTransmissionInputs {...defaultProps} />);

    const addButton = screen.getByText("Add New Inventory");

    fireEvent.click(addButton);

    expect(defaultProps.onAddAntenna).toHaveBeenCalledTimes(1);
  });

  it("calls onRemoveAntenna when trash button is clicked", () => {
    render(<AntennaTransmissionInputs {...defaultProps} />);

    const trashButton = screen
      .getAllByRole("button")
      .find((button) => button.getAttribute("color") === "danger");

    fireEvent.click(trashButton as HTMLElement);

    expect(defaultProps.onRemoveAntenna).toHaveBeenCalledWith(0);
  });

  it("calls onDuplicateAntenna when copy button is clicked", () => {
    render(<AntennaTransmissionInputs {...defaultProps} />);

    const copyButton = screen
      .getAllByRole("button")
      .find(
        (button) =>
          button.getAttribute("color") === "primary" &&
          button.querySelector(".lucide-copy"),
      );

    fireEvent.click(copyButton as HTMLElement);

    expect(defaultProps.onDuplicateAntenna).toHaveBeenCalledWith(0);
  });

  it("calls onAntennaChange when input values change", () => {
    render(<AntennaTransmissionInputs {...defaultProps} />);

    const elevationInput = screen.getByDisplayValue("10.0");

    fireEvent.change(elevationInput, { target: { value: "20.0" } });

    expect(defaultProps.onAntennaChange).toHaveBeenCalledWith(
      0,
      "elevation",
      "20.0",
    );
  });

  it("renders empty state correctly", () => {
    render(
      <AntennaTransmissionInputs {...defaultProps} antennaInventory={[]} />,
    );

    expect(screen.queryByDisplayValue("10.0")).not.toBeInTheDocument();
    expect(screen.getByText("Add New Inventory")).toBeInTheDocument();
  });

  it("renders multiple antennas correctly", () => {
    const multipleAntennas = [
      mockAntenna,
      { ...mockAntenna, id: "2", elevation: "20.0" },
    ];

    render(
      <AntennaTransmissionInputs
        {...defaultProps}
        antennaInventory={multipleAntennas}
      />,
    );

    expect(screen.getByDisplayValue("10.0")).toBeInTheDocument();
    expect(screen.getByDisplayValue("20.0")).toBeInTheDocument();
    // Find delete buttons by button color
    const deleteButtons = screen
      .getAllByRole("button")
      .filter((button) => button.getAttribute("color") === "danger");

    expect(deleteButtons).toHaveLength(2);
  });

  it("input fields have correct placeholders", () => {
    render(
      <AntennaTransmissionInputs
        {...defaultProps}
        antennaInventory={[
          {
            ...mockAntenna,
            id: "new",
            elevation: "",
            equipment: "",
            quantity: "",
            azimuth: "",
            tx_line: "",
            odu: "",
            carrier: "",
          },
        ]}
      />,
    );

    // Query by input attributes instead of role
    const inputFields = {
      elevation: screen.getByPlaceholderText("0.0"),
      equipment: screen.getByPlaceholderText("Equipment"),
      quantity: screen.getAllByPlaceholderText("0")[0], // Get first occurrence
      azimuth: screen.getAllByPlaceholderText("0")[1], // Get second occurrence
      tx_line: screen.getByPlaceholderText("TX Line"),
      odu: screen.getByPlaceholderText("ODU"),
      carrier: screen.getByPlaceholderText("Carrier"),
    };

    // Verify placeholders
    Object.entries(inputFields).forEach(([field, element]) => {
      expect(element).toHaveAttribute("name", field);
      expect(element).toHaveAttribute(
        "placeholder",
        field === "elevation"
          ? "0.0"
          : field === "quantity" || field === "azimuth"
            ? "0"
            : field === "tx_line"
              ? "TX Line"
              : field === "odu"
                ? "ODU"
                : field === "carrier"
                  ? "Carrier"
                  : "Equipment",
      );
    });
  });
});
