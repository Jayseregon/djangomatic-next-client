"use client";

import { useState, useMemo } from "react";
import { Tabs, Tab } from "@heroui/react";

import { useAppTrackingData } from "@/src/hooks/useAppTrackingData";

import { AppTrackingBoard } from "./AppTrackingBoard";

// Client component that uses session
export const AppTrackingDashboard = () => {
  const { data, isLoading, error, reload, years } = useAppTrackingData();

  // Default to current year or most recent year in data
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(
    years.includes(currentYear) ? currentYear : years[0] || currentYear,
  );

  // Filter data by selected year
  const filteredData = useMemo(() => {
    if (!selectedYear || years.length === 0) return data;

    return data.filter((item) => {
      // If item has monthly usage data, check if it has usage in the selected year
      if (item.monthlyUsage) {
        // Check if there's any usage in the selected year
        return item.monthlyUsage.some((m) => m.count > 0);
      }

      return true; // Include items without monthly data
    });
  }, [data, selectedYear, years]);

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
      <AppTrackingBoard
        data={filteredData}
        error={error}
        isLoading={isLoading}
        reload={reload}
        selectedYear={selectedYear}
      />
    </>
  );
};
