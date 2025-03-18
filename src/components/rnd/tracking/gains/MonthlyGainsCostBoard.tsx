"use client";

import React, { useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@heroui/react";
import { Save, CircleOff, DollarSign, Hash } from "lucide-react";

import { CellEditData, MonthlyGainsCostBoardProps } from "@/src/interfaces/rnd";
import { getFiscalMonths } from "@/src/components/rnd/tracking/getFiscalMonths";
import { MonthlyDataTable } from "@/components/rnd/tracking/MonthlyDataTable";

export const MonthlyGainsCostBoard = ({
  record,
  onUpdateMonthlyCost,
  isLoading = false,
}: MonthlyGainsCostBoardProps) => {
  // Edit modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingCell, setEditingCell] = useState<CellEditData | null>(null);

  // Cost calculation fields - using strings to allow empty inputs
  const [count, setCount] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  const [adjustedCost, setAdjustedCost] = useState<string>("");

  // Calculated values - safely parse numbers or use 0
  const parsedCount = useMemo(
    () => (count === "" ? 0 : parseFloat(count) || 0),
    [count],
  );
  const parsedRate = useMemo(
    () => (rate === "" ? 0 : parseFloat(rate) || 0),
    [rate],
  );
  const parsedAdjust = useMemo(
    () => (adjustedCost === "" ? 0 : parseFloat(adjustedCost) || 0),
    [adjustedCost],
  );

  // Calculate subtotal and grand total
  const subtotal = useMemo(
    () => parsedCount * parsedRate,
    [parsedCount, parsedRate],
  );
  const grandTotal = useMemo(
    () => subtotal + parsedAdjust,
    [subtotal, parsedAdjust],
  );

  // Handle cell click to open edit modal
  const handleCellClick = (cellData: CellEditData) => {
    setEditingCell(cellData);

    // Check if we have existing values in the database for this month
    const monthData = record.monthlyCosts?.find(
      (mc) => mc.month === cellData.month,
    );

    // If we have existing data, use it to populate the fields
    if (monthData) {
      setCount(monthData.count?.toString() || "");
      setRate(monthData.rate?.toString() || "");
      setAdjustedCost(monthData.adjustedCost?.toString() || "");
    } else {
      // For new entries, leave fields empty
      setCount("");
      setRate("");
      setAdjustedCost("");
    }

    onOpen();
  };

  // Handle saving updated cell value
  const handleSaveEdit = () => {
    if (editingCell && onUpdateMonthlyCost) {
      // Use the grandTotal as the final value and pass calculation details
      onUpdateMonthlyCost(editingCell.month, grandTotal, {
        count: parsedCount,
        rate: parsedRate,
        adjustedCost: parsedAdjust,
      });
    }
    onClose();
  };

  // Reset form when modal closes
  const handleCloseModal = () => {
    setCount("");
    setRate("");
    setAdjustedCost("");
    onClose();
  };

  // Generate monthly cost data from the record's monthly costs
  const monthlyData = useMemo(() => {
    // If we have actual monthly costs data, map it to match the expected format
    if (record.monthlyCosts && record.monthlyCosts.length > 0) {
      return getFiscalMonths.map((month) => {
        const monthData = record.monthlyCosts?.find((mc) => mc.month === month);

        return {
          month,
          cost: monthData ? monthData.cost : 0,
        };
      });
    }

    // Fallback to empty data if no monthly costs are available
    return getFiscalMonths.map((month) => ({
      month,
      cost: 0,
    }));
  }, [record]);

  const totalCost = useMemo(() => {
    return monthlyData.reduce((acc, curr) => acc + curr.cost, 0);
  }, [monthlyData]);

  return (
    <>
      <MonthlyDataTable
        data={monthlyData}
        isCellEditable={Boolean(onUpdateMonthlyCost)}
        isLoading={isLoading}
        tableAriaLabel="monthly-costs-table"
        tableStyles={{
          base: "text-center",
          header: "bg-primary text-background",
        }}
        total={totalCost}
        totalFormat={(value) => `$${value.toLocaleString()}`}
        valueField="cost"
        valueFormat={(value) => `$${value.toLocaleString()}`}
        onCellClick={handleCellClick}
      />

      {/* Edit Modal */}
      <Modal
        hideCloseButton
        aria-labelledby="edit-cost-modal"
        backdrop="blur"
        classNames={{
          base: "bg-background border border-foreground",
        }}
        isOpen={isOpen}
        size="2xl"
        onClose={handleCloseModal}
      >
        <ModalContent>
          <ModalHeader>Edit {editingCell?.month} Cost</ModalHeader>
          <ModalBody>
            <div className="flex flex-row gap-2">
              <Input
                isClearable
                className="basis-1/2"
                classNames={{
                  input: "border-0 focus:ring-0",
                  inputWrapper: "border-foreground/50 hover:!border-foreground",
                }}
                label="Count"
                labelPlacement="outside"
                placeholder="Enter count..."
                startContent={<Hash />}
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                onClear={() => setCount("")}
              />
              <Input
                isClearable
                className="basis-1/2"
                classNames={{
                  input: "border-0 focus:ring-0",
                  inputWrapper: "border-foreground/50 hover:!border-foreground",
                }}
                label="Rate"
                labelPlacement="outside"
                placeholder="Enter rate..."
                startContent={<DollarSign />}
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                onClear={() => setRate("")}
              />
              <Input
                readOnly
                className="basis-1/2"
                classNames={{
                  input: "border-0 focus:ring-0",
                  inputWrapper: "border-foreground/50 hover:!border-foreground",
                }}
                label="Subtotal"
                labelPlacement="outside"
                startContent={<DollarSign />}
                type="text"
                value={subtotal > 0 ? `$${subtotal.toLocaleString()}` : ""}
              />
            </div>
            <Input
              isClearable
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              label="Adjusted Cost"
              labelPlacement="outside"
              placeholder="Enter adjustment..."
              startContent={<DollarSign />}
              type="number"
              value={adjustedCost}
              onChange={(e) => setAdjustedCost(e.target.value)}
              onClear={() => setAdjustedCost("")}
            />
            <Input
              readOnly
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              label="Grand Total"
              labelPlacement="outside"
              startContent={<DollarSign />}
              type="text"
              value={grandTotal > 0 ? `$${grandTotal.toLocaleString()}` : ""}
            />
          </ModalBody>
          <ModalFooter>
            <div className="flex flex-row gap-3">
              <Button
                isIconOnly
                aria-label="Save Edit"
                color="success"
                onPress={handleSaveEdit}
              >
                <Save />
              </Button>
              <Button
                isIconOnly
                aria-label="Close Modal"
                color="danger"
                variant="bordered"
                onPress={handleCloseModal}
              >
                <CircleOff />
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
