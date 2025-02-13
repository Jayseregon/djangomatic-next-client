import { useState, useEffect, useCallback } from "react";

import { AppGroup } from "@/interfaces/rnd";
import {
  getAppTrackingEntries,
  getPciReportsEntries,
} from "@/actions/prisma/tracking/action";
import { groupByAppName, groupPciReports } from "@/lib/appTrackingUtils";
import { TowerReport } from "@/interfaces/reports";

export const useAppTrackingData = () => {
  const [data, setData] = useState<AppGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const appRecords = await getAppTrackingEntries();

      if (!appRecords) {
        throw new Error("No app records found");
      }

      const pciReportsRecords = await getPciReportsEntries();

      if (!pciReportsRecords) {
        throw new Error("No PCI reports found");
      }

      const reducedRecords = groupByAppName(appRecords);
      const reducedReportsRecords = groupPciReports(
        pciReportsRecords as TowerReport[],
      );

      reducedRecords.push(...reducedReportsRecords);

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
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
};
