"use client";

import { useState, useMemo, useEffect } from "react";
import { Tabs, Tab } from "@heroui/react";

import { GainsTrackingBoard } from "@/src/components/rnd/tracking/gains/GainsTrackingBoard";
import {
  getGainsTrackingRecords,
  getGainsTrackingFiscalYears,
} from "@/src/actions/prisma/tracking/action";
import { GainsTrackingRecordItem } from "@/src/interfaces/rnd";
import { LoadingContent } from "@/components/ui/LoadingContent";

export const GainsTrackingDashboard = () => {
  const [data, setData] = useState<GainsTrackingRecordItem[]>([]);
  const [fiscalYears, setFiscalYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [records, years] = await Promise.all([
          getGainsTrackingRecords(),
          getGainsTrackingFiscalYears(),
        ]);

        // Use current year if no years in database
        const availableYears =
          years.length > 0 ? years : [new Date().getFullYear()];

        setData(records as GainsTrackingRecordItem[]);
        setFiscalYears(availableYears);
      } catch (err) {
        setError((err as Error).message);
        console.error("Error loading gains tracking data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Default to current year or first available year
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(
    fiscalYears.includes(currentYear)
      ? currentYear
      : fiscalYears[0] || currentYear,
  );

  // Update selected year when fiscal years are loaded
  useEffect(() => {
    if (fiscalYears.length > 0) {
      setSelectedYear(
        fiscalYears.includes(currentYear) ? currentYear : fiscalYears[0],
      );
    }
  }, [fiscalYears, currentYear]);

  // Filter data by selected fiscal year
  const filteredData = useMemo(() => {
    if (data.length === 0) return [];

    // If the record has monthly costs for the selected year or no costs yet, include it
    return data.filter(
      (record) =>
        record.monthlyCosts.length === 0 ||
        record.monthlyCosts.some((mc) => mc.fiscalYear === selectedYear),
    );
  }, [data, selectedYear]);

  if (isLoading) {
    return <LoadingContent />;
  }

  if (error) {
    return <div className="text-danger">Error loading data: {error}</div>;
  }

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
          {fiscalYears.map((year) => (
            <Tab key={year.toString()} title={year.toString()} />
          ))}
        </Tabs>
      </div>
      <GainsTrackingBoard data={filteredData} />
    </>
  );
};
