"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useDisclosure } from "@heroui/react";

import { CellEditData, MonthlyGainsCostBoardProps } from "@/src/interfaces/rnd";
import { getFiscalMonths } from "@/src/components/rnd/tracking/getFiscalMonths";
import { MonthlyDataTable } from "@/components/rnd/tracking/MonthlyDataTable";
import { EditCostModal } from "@/components/rnd/tracking/gains/EditCostModal";

// Add React.memo to make this component only re-render when props change
export const MonthlyGainsCostBoard = React.memo(
  ({
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
    const handleCellClick = useCallback(
      (cellData: CellEditData) => {
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
      },
      [record, onOpen],
    );

    // Handle saving updated cell value
    const handleSaveEdit = useCallback(() => {
      if (editingCell && onUpdateMonthlyCost) {
        // Use the grandTotal as the final value and pass calculation details
        onUpdateMonthlyCost(editingCell.month, grandTotal, {
          count: parsedCount,
          rate: parsedRate,
          adjustedCost: parsedAdjust,
        });
      }
      onClose();
    }, [
      editingCell,
      grandTotal,
      onUpdateMonthlyCost,
      parsedCount,
      parsedRate,
      parsedAdjust,
      onClose,
    ]);

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
          const monthData = record.monthlyCosts?.find(
            (mc) => mc.month === month,
          );

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
    }, [record.monthlyCosts]); // Only depend on monthlyCosts, not the entire record

    const totalCost = useMemo(() => {
      return monthlyData.reduce((acc, curr) => acc + curr.cost, 0);
    }, [monthlyData]);

    // Memoize the table component to prevent unnecessary re-renders
    const monthlyTable = useMemo(
      () => (
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
      ),
      [monthlyData, onUpdateMonthlyCost, isLoading, totalCost, handleCellClick],
    );

    return (
      <>
        {monthlyTable}

        <EditCostModal
          adjustedCost={adjustedCost}
          count={count}
          editingCell={editingCell}
          grandTotal={grandTotal}
          isOpen={isOpen}
          rate={rate}
          setAdjustedCost={setAdjustedCost}
          setCount={setCount}
          setRate={setRate}
          subtotal={subtotal}
          onClose={handleCloseModal}
          onSave={handleSaveEdit}
        />
      </>
    );
  },
);

// Add displayName for debugging purposes
MonthlyGainsCostBoard.displayName = "MonthlyGainsCostBoard";
