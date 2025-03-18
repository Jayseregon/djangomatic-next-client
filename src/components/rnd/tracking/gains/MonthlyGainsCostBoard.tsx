"use client";

import React, { useMemo } from "react";

import { GainsTrackingRecordItem } from "@/src/interfaces/rnd";
import { getFiscalMonths } from "@/src/components/rnd/tracking/getFiscalMonths";
import { MonthlyDataTable } from "@/components/rnd/tracking/MonthlyDataTable";

export const MonthlyGainsCostBoard = ({
  record,
}: {
  record: GainsTrackingRecordItem;
}) => {
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
