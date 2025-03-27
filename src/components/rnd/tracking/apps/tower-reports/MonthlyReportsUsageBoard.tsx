"use client";

import React from "react";
import { Button } from "@heroui/react";
import { RefreshCcw } from "lucide-react";

import { LoadingContent } from "@/components/ui/LoadingContent";
import { MonthlyReportsUsageBoardProps } from "@/interfaces/rnd";
import { MonthlyDataTable } from "@/src/components/rnd/tracking/MonthlyDataTable";

export const MonthlyReportsUsageBoard = ({
  data,
  isLoading,
  error,
  reload,
  selectedYear,
  totalCount,
}: MonthlyReportsUsageBoardProps) => {
  if (error) {
    throw new Error(error);
  }

  const topContent = () => {
    return (
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            isIconOnly
            color="primary"
            onPress={() => {
              reload();
            }}
          >
            <RefreshCcw />
          </Button>
        </div>
        {selectedYear && (
          <div className="text-lg font-medium">
            Showing {totalCount} reports for {selectedYear}
          </div>
        )}
      </div>
    );
  };

  return (
    <MonthlyDataTable
      data={data}
      emptyContent="No reports found"
      isLoading={isLoading}
      loadingContent={<LoadingContent />}
      tableAriaLabel="tower-report-tracking-board"
      tableStyles={{
        base: "text-center",
        header: "uppercase bg-foreground text-background",
      }}
      topContent={topContent()}
      total={totalCount}
      valueField="count"
    />
  );
};
