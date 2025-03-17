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

import { AppGroup } from "@/src/interfaces/rnd";
import { MONTHS } from "@/components/rnd/tracking/MockData";

export const MonthlyAppUsageBoard = ({ item }: { item: AppGroup }) => {
  // Generate monthly usage data for fiscal year (Dec-Nov)
  const monthlyData = useMemo(() => {
    // If we have actual monthly data, use it
    if (item.monthlyUsage && item.monthlyUsage.length > 0) {
      return item.monthlyUsage;
    }

    // Otherwise generate placeholder data
    return MONTHS.map((month) => ({
      month,
      count: 0,
    }));
  }, [item]);

  const totalUsage = useMemo(() => {
    return monthlyData.reduce((acc, curr) => acc + curr.count, 0);
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
          {data && data.count > 0 ? data.count.toLocaleString() : "-"}
        </TableCell>
      );
    });

    return [
      ...monthCells,
      <TableCell key="total" className="font-bold">
        {totalUsage.toLocaleString()}
      </TableCell>,
    ];
  }, [monthlyData, totalUsage]);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <Table
          removeWrapper
          aria-label="monthly-usage-table"
          classNames={{
            base: "text-center",
            th: "bg-primary-100 text-primary-800",
          }}
          selectionMode="none"
        >
          <TableHeader>{columns}</TableHeader>
          <TableBody>
            <TableRow key="usage">{cells}</TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
