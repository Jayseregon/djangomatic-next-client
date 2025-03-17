"use client";

import React, { useMemo } from "react";

import { AppGroup } from "@/src/interfaces/rnd";
import { MONTHS } from "@/components/rnd/tracking/MockData";
import { MonthlyDataTable } from "@/components/rnd/tracking/MonthlyDataTable";

export const MonthlyAppsUsageBoard = ({ item }: { item: AppGroup }) => {
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

  return (
    <MonthlyDataTable
      data={monthlyData}
      tableAriaLabel="monthly-usage-table"
      tableStyles={{
        base: "text-center",
        header: "bg-primary text-background",
      }}
      total={totalUsage}
      valueField="count"
    />
  );
};
