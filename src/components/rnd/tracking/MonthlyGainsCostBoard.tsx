"use client";

import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableCell,
  TableRow,
} from "@heroui/react";

import { GainTrackingItem } from "@/src/interfaces/rnd";

import { MONTHS } from "./MockData";

export const MonthlyGainsCostBoard = ({ item }: { item: GainTrackingItem }) => {
  // Generate monthly cost data for fiscal year (Dec-Nov)
  const monthlyData = useMemo(() => {
    // If we have actual monthly data, use it
    if (item.monthlyCosts && item.monthlyCosts.length > 0) {
      return item.monthlyCosts;
    }

    // Otherwise generate placeholder data
    return MONTHS.map((month) => ({
      month,
      cost: 0,
    }));
  }, [item]);

  const totalCost = useMemo(() => {
    return monthlyData.reduce((acc, curr) => acc + curr.cost, 0);
  }, [monthlyData]);

  // Create column and cell lists to avoid TypeScript errors
  const columns = useMemo(() => {
    const monthColumns = MONTHS.map((month) => (
      <TableColumn key={month} className="text-center">
        {month}
      </TableColumn>
    ));

    return [
      ...monthColumns,
      <TableColumn key="total" className="text-center font-bold">
        Total
      </TableColumn>,
    ];
  }, []);

  const cells = useMemo(() => {
    const monthCells = MONTHS.map((month) => {
      const data = monthlyData.find((d) => d.month === month);

      return (
        <TableCell key={month}>
          {data && data.cost > 0 ? `$${data.cost.toLocaleString()}` : "-"}
        </TableCell>
      );
    });

    return [
      ...monthCells,
      <TableCell key="total" className="font-bold">
        ${totalCost.toLocaleString()}
      </TableCell>,
    ];
  }, [monthlyData, totalCost]);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <Table
          removeWrapper
          aria-label="monthly-costs-table"
          classNames={{
            base: "text-center",
            th: "bg-primary-100 text-primary-800",
          }}
          selectionMode="none"
        >
          <TableHeader>{columns}</TableHeader>
          <TableBody>
            <TableRow key="costs">{cells}</TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
