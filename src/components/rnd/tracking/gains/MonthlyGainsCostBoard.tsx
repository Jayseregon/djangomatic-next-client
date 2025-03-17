"use client";

import React, { useMemo } from "react";

import { GainTrackingItem } from "@/src/interfaces/rnd";
import { getFiscalMonths } from "@/src/components/rnd/tracking/getFiscalMonths";
import { MonthlyDataTable } from "@/components/rnd/tracking/MonthlyDataTable";

export const MonthlyGainsCostBoard = ({ item }: { item: GainTrackingItem }) => {
  // Generate monthly cost data for fiscal year (Dec-Nov)
  const monthlyData = useMemo(() => {
    // If we have actual monthly data, use it
    if (item.monthlyCosts && item.monthlyCosts.length > 0) {
      return item.monthlyCosts;
    }

    // Otherwise generate placeholder data
    return getFiscalMonths.map((month) => ({
      month,
      cost: 0,
    }));
  }, [item]);

  const totalCost = useMemo(() => {
    return monthlyData.reduce((acc, curr) => acc + curr.cost, 0);
  }, [monthlyData]);

  return (
    <MonthlyDataTable
      data={monthlyData}
      tableAriaLabel="monthly-costs-table"
      tableStyles={{
        base: "text-center",
        header: "bg-primary text-background",
      }}
      total={totalCost}
      totalFormat={(value) => `$${value.toLocaleString()}`}
      valueField="cost"
      valueFormat={(value) => `$${value.toLocaleString()}`}
    />
  );
};
