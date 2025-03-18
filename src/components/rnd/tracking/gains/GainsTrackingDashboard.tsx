"use client";

import { useState, useMemo } from "react";
import { Tabs, Tab } from "@heroui/react";

import { GainsTrackingBoard } from "@/src/components/rnd/tracking/gains/GainsTrackingBoard";
import { mockGainsRecords } from "@/src/components/rnd/tracking/MockData";

// Client component that uses session
export const GainsTrackingDashboard = () => {
  // Get fiscal years from the data
  const availableYears = useMemo(() => {
    const years = new Set<number>();

    // Extract unique fiscal years from all monthly costs
    mockGainsRecords.forEach((record) => {
      record.monthlyCosts.forEach((mc) => {
        years.add(mc.fiscalYear);
      });
    });

    return Array.from(years).sort().reverse();
  }, []);

  // Default to current year or most recent year in data
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(
    availableYears.includes(currentYear) ? currentYear : availableYears[0],
  );

  // Filter data by selected fiscal year
  const filteredData = useMemo(() => {
    return mockGainsRecords.filter((record) =>
      record.monthlyCosts.some((mc) => mc.fiscalYear === selectedYear),
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
