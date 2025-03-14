import { useState, useEffect, useCallback } from "react";

import { AppGroup, AppUsageTracking } from "@/interfaces/rnd";
import { getAppTrackingEntries } from "@/actions/prisma/tracking/action";
import { groupByAppName } from "@/lib/appTrackingUtils";
import { MONTHS } from "@/src/components/rnd/tracking/MockData";

// Helper function to calculate monthly usage from raw tracking data
const calculateMonthlyUsage = (
  appRecords: AppUsageTracking[],
  appName: string,
  year?: number,
): { month: string; count: number }[] => {
  // Create a map to store counts by month
  const monthlyMap = new Map<string, number>();

  // Initialize all months with zero
  MONTHS.forEach((month) => {
    monthlyMap.set(month, 0);
  });

  // Count occurrences by month
  appRecords
    .filter((record) => {
      const recordDate = new Date(record.createdAt);
      const recordYear = recordDate.getFullYear();

      return record.app_name === appName && (!year || recordYear === year);
    })
    .forEach((record) => {
      const date = new Date(record.createdAt);
      const monthIndex = date.getMonth(); // 0-11
      const monthName = MONTHS[(monthIndex + 1) % 12]; // Adjust to fiscal year (Dec=0)

      const currentCount = monthlyMap.get(monthName) || 0;

      monthlyMap.set(monthName, currentCount + 1);
    });

  // Convert map to array of objects
  return MONTHS.map((month) => ({
    month,
    count: monthlyMap.get(month) || 0,
  }));
};

export const useAppTrackingData = (filterYear?: number) => {
  const [data, setData] = useState<AppGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [years, setYears] = useState<number[]>([]);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const appRecords = await getAppTrackingEntries();

      if (!appRecords) {
        throw new Error("No app records found");
      }

      // Calculate available years from the data
      const yearSet = new Set<number>();

      appRecords.forEach((record) => {
        const year = new Date(record.createdAt).getFullYear();

        yearSet.add(year);
      });
      const availableYears = Array.from(yearSet).sort().reverse();

      setYears(availableYears);

      // const pciReportsRecords = await getPciReportsEntries();

      // if (!pciReportsRecords) {
      //   throw new Error("No PCI reports found");
      // }

      const reducedRecords = groupByAppName(appRecords);
      // const reducedReportsRecords = groupPciReports(
      //   pciReportsRecords as TowerReport[],
      // );

      // reducedRecords.push(...reducedReportsRecords);

      // Add monthly usage data to each app group
      reducedRecords.forEach((record) => {
        record.monthlyUsage = calculateMonthlyUsage(
          appRecords,
          record.app_name,
          filterYear,
        );
      });

      // If filtering by year, only include records with usage in that year
      const filteredRecords = filterYear
        ? reducedRecords.filter((record) =>
            record.monthlyUsage?.some((m) => m.count > 0),
          )
        : reducedRecords;

      filteredRecords.sort((a, b) => {
        if (a.app_name < b.app_name) return -1;
        if (a.app_name > b.app_name) return 1;

        return 0;
      });

      setData(filteredRecords);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [filterYear]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload, years };
};
