import { useState, useEffect, useCallback } from "react";

import { AppGroup, AppUsageTracking } from "@/interfaces/rnd";
import { getAppTrackingEntries } from "@/actions/prisma/tracking/action";
import { groupByAppName } from "@/lib/appTrackingUtils";
import { getFiscalMonths } from "@/src/components/rnd/tracking/getFiscalMonths";

// Helper function to calculate monthly usage from raw tracking data
const calculateMonthlyUsage = (
  appRecords: AppUsageTracking[],
  appName: string,
  year?: number,
): { month: string; count: number }[] => {
  // Create a map to store counts by month
  const monthlyMap = new Map<string, number>();

  // Initialize all months with zero
  getFiscalMonths.forEach((month) => {
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
      const monthName = getFiscalMonths[(monthIndex + 1) % 12]; // Adjust to fiscal year (Dec=0)

      const currentCount = monthlyMap.get(monthName) || 0;

      monthlyMap.set(monthName, currentCount + 1);
    });

  // Convert map to array of objects
  return getFiscalMonths.map((month) => ({
    month,
    count: monthlyMap.get(month) || 0,
  }));
};

export const useAppsTrackingData = (filterYear?: number) => {
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

      appRecords.forEach((record: AppUsageTracking) => {
        const year = new Date(record.createdAt).getFullYear();

        yearSet.add(year);
      });
      const availableYears = Array.from(yearSet).sort().reverse();

      setYears(availableYears);

      // const pciReportsRecords = await getPciReportsEntries();

      // if (!pciReportsRecords) {
      //   throw new Error("No PCI reports found");
      // }

      // const reducedReportsRecords = groupPciReports(
      //   pciReportsRecords as TowerReport[],
      // );

      // reducedRecords.push(...reducedReportsRecords);

      // Filter records by year if a filter is specified
      const filteredRecords = filterYear
        ? appRecords.filter((record: AppUsageTracking) => {
            const recordYear = new Date(record.createdAt).getFullYear();

            return recordYear === filterYear;
          })
        : appRecords;

      // Group by app name using the filtered records
      const reducedRecords = groupByAppName(filteredRecords);

      // Add monthly usage data to each app group
      reducedRecords.forEach((record) => {
        record.monthlyUsage = calculateMonthlyUsage(
          appRecords,
          record.app_name,
          filterYear,
        );
      });

      // Sort records by app name
      reducedRecords.sort((a, b) => {
        if (a.app_name < b.app_name) return -1;
        if (a.app_name > b.app_name) return 1;

        return 0;
      });

      setData(reducedRecords);
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
