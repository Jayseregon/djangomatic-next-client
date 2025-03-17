"use client";

import React, { useMemo, ReactNode } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableCell,
  TableRow,
} from "@heroui/react";

import { MONTHS } from "@/src/components/rnd/tracking/MockData";

interface MonthlyData {
  month: string;
  [key: string]: any; // Could be count, cost, or any other value
}

interface MonthlyDataTableProps {
  data: MonthlyData[];
  valueField?: string;
  valueFormat?: (value: number) => string;
  total: number;
  totalFormat?: (value: number) => string;
  isLoading?: boolean;
  loadingContent?: ReactNode;
  emptyContent?: string;
  tableAriaLabel?: string;
  tableStyles?: {
    base?: string;
    header?: string;
  };
  topContent?: ReactNode;
}

export const MonthlyDataTable = ({
  data,
  valueField = "count",
  valueFormat = (value) => value.toLocaleString(),
  total,
  totalFormat = (value) => value.toLocaleString(),
  isLoading = false,
  loadingContent,
  emptyContent = "No data available",
  tableAriaLabel = "monthly-data-table",
  tableStyles = {
    base: "text-center",
    header: "bg-primary text-background",
  },
  topContent,
}: MonthlyDataTableProps) => {
  // Create column and cell lists
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
      const monthData = data.find((item) => item.month === month);
      const value =
        monthData && monthData[valueField] > 0
          ? valueFormat(monthData[valueField])
          : "-";

      return (
        <TableCell key={month} className="text-center">
          {value}
        </TableCell>
      );
    });

    return [
      ...monthCells,
      <TableCell key="total" className="text-center font-bold">
        {totalFormat(total)}
      </TableCell>,
    ];
  }, [data, valueField, valueFormat, total, totalFormat]);

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        {isLoading ? (
          loadingContent || <div>Loading...</div>
        ) : data.length === 0 ? (
          <div>{emptyContent}</div>
        ) : (
          <Table
            removeWrapper
            aria-label={tableAriaLabel}
            classNames={{
              base: tableStyles.base,
              th: tableStyles.header,
            }}
            selectionMode="none"
            topContent={topContent}
          >
            <TableHeader>{columns}</TableHeader>
            <TableBody>
              <TableRow key="data-row">{cells}</TableRow>
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
