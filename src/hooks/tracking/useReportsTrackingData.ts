import { useState, useEffect, useCallback } from "react";

import { getPciReportsEntries } from "@/actions/prisma/tracking/action";
import { MONTHS } from "@/src/components/rnd/tracking/MockData";
import { TowerReportForTracking } from "@/interfaces/rnd";

// Helper function to calculate monthly counts
const calculateMonthlyReports = (
  reports: TowerReportForTracking[],
  year?: number,
): { month: string; count: number }[] => {
  // Create a map to store counts by month
  const monthlyMap = new Map<string, number>();

  // Initialize all months with zero
  MONTHS.forEach((month) => {
    monthlyMap.set(month, 0);
  });

  // Count occurrences by month
  reports
    .filter((report) => {
      const reportDate = new Date(report.createdAt);
      const reportYear = reportDate.getFullYear();

      return !year || reportYear === year;
    })
    .forEach((report) => {
      const date = new Date(report.createdAt);
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

export const useReportsTrackingData = (filterYear?: number) => {
  const [data, setData] = useState<{ month: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [years, setYears] = useState<number[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Cast to our minimal type that only requires the fields we need
      const reports =
        (await getPciReportsEntries()) as unknown as TowerReportForTracking[];

      if (!reports) {
        throw new Error("No tower reports found");
      }

      // Calculate available years from the data
      const yearSet = new Set<number>();

      reports.forEach((report) => {
        const year = new Date(report.createdAt).getFullYear();

        yearSet.add(year);
      });
      const availableYears = Array.from(yearSet).sort().reverse();

      setYears(availableYears);

      // Calculate monthly data based on filtered year
      const monthlyData = calculateMonthlyReports(reports, filterYear);

      setData(monthlyData);

      // Calculate total count for the selected year
      const total = filterYear
        ? reports.filter((report) => {
            const reportYear = new Date(report.createdAt).getFullYear();

            return reportYear === filterYear;
          }).length
        : reports.length;

      setTotalCount(total);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [filterYear]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload, years, totalCount };
};
