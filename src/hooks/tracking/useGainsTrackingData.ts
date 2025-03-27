import { useState, useEffect, useMemo, useCallback } from "react";

import { GainsTrackingRecordItem } from "@/src/interfaces/rnd";
import {
  getGainsTrackingRecords,
  getGainsTrackingFiscalYears,
} from "@/src/actions/prisma/tracking/action";

export const useGainsTrackingData = () => {
  const [data, setData] = useState<GainsTrackingRecordItem[]>([]);
  const [fiscalYears, setFiscalYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default to current year or first available year
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  // Fetch data function that can be called to reload data
  const reload = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [records, years] = await Promise.all([
        getGainsTrackingRecords(),
        getGainsTrackingFiscalYears(),
      ]);

      // Use current year if no years in database
      const availableYears = years.length > 0 ? years : [currentYear];

      setData(records as GainsTrackingRecordItem[]);
      setFiscalYears(availableYears);

      // Update selected year if needed
      if (!selectedYear || !availableYears.includes(selectedYear)) {
        setSelectedYear(
          availableYears.includes(currentYear)
            ? currentYear
            : availableYears[0],
        );
      }
    } catch (err) {
      setError((err as Error).message);
      console.error("Error loading gains tracking data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentYear, selectedYear]);

  // Initial data load
  useEffect(() => {
    reload();
  }, [reload]);

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

  return {
    data: filteredData,
    allData: data,
    fiscalYears,
    selectedYear,
    setSelectedYear,
    isLoading,
    error,
    reload,
  };
};
