"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";

import { useAppTrackingData } from "@/src/hooks/useAppTrackingData";

import { AppsTrackingBoard } from "./AppsTrackingBoard";

// Client component that uses session
export const AppsTrackingDashboard = () => {
  // Default to current year
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Pass selected year to the hook
  const { data, isLoading, error, reload, years } =
    useAppTrackingData(selectedYear);

  // Set initial selected year after loading years
  useState(() => {
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
  });

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
      <AppsTrackingBoard
        data={data}
        error={error}
        isLoading={isLoading}
        reload={reload}
        selectedYear={selectedYear}
      />
    </>
  );
};
