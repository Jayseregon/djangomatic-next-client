"use client";

// import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { Tabs, Tab } from "@heroui/react";

import { GainsTrackingBoard } from "@/src/components/rnd/tracking/GainsTrackingBoard";

import { mockData } from "./MockData";

// Client component that uses session
export const GainsTrackingDashboard = () => {
  //   const t = useTranslations("RnD.gainsTracking");

  // Get all available years from the data
  const availableYears = useMemo(() => {
    const years = new Set(
      mockData.map((item) => new Date(item.implementationDate).getFullYear()),
    );

    return Array.from(years).sort().reverse();
  }, []);

  // Default to current year or most recent year in data
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(
    availableYears.includes(currentYear) ? currentYear : availableYears[0],
  );

  // Filter data by selected year
  const filteredData = useMemo(() => {
    return mockData.filter(
      (item) =>
        new Date(item.implementationDate).getFullYear() === selectedYear,
    );
  }, [selectedYear]);

  return (
    <>
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
          {availableYears.map((year) => (
            <Tab key={year.toString()} title={year.toString()} />
          ))}
        </Tabs>
      </div>
      <GainsTrackingBoard data={filteredData} />
    </>
  );
};
