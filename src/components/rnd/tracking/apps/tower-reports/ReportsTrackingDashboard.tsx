"use client";

import { useState, useEffect } from "react";
import { Tabs, Tab } from "@heroui/react";

import { useReportsTrackingData } from "@/src/hooks/tracking/useReportsTrackingData";

import { MonthlyReportsUsageBoard } from "./MonthlyReportsUsageBoard";

// Client component that uses session
export const ReportsTrackingDashboard = () => {
  // Default to current year
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Pass selected year to the hook
  const { data, isLoading, error, reload, years, totalCount } =
    useReportsTrackingData(selectedYear);

  // Set initial selected year after loading years
  useEffect(() => {
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  return (
    <>
      {years.length > 0 && (
        <div className="mt-8">
          <Tabs
            classNames={{
              tabList: "gap-6",
              cursor: "w-full bg-primary",
              tab: "max-w-fit px-2",
              tabContent: "group-data-[selected=true]:text-primary",
            }}
            color="primary"
            selectedKey={selectedYear.toString()}
            variant="underlined"
            onSelectionChange={(key) => setSelectedYear(Number(key))}
          >
            {years.map((year) => (
              <Tab key={year.toString()} title={year.toString()} />
            ))}
          </Tabs>
        </div>
      )}
      <MonthlyReportsUsageBoard
        data={data}
        error={error}
        isLoading={isLoading}
        reload={reload}
        selectedYear={selectedYear}
        totalCount={totalCount}
      />
    </>
  );
};
