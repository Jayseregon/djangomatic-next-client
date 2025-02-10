import { useState, useEffect, useCallback } from "react";

import { AppGroup } from "@/interfaces/rnd";
import { getAppTrackingEntries } from "@/actions/prisma/tracking/action";
import { groupByAppName } from "@/lib/appTrackingUtils";

export const useAppTrackingData = () => {
  const [data, setData] = useState<AppGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const records = await getAppTrackingEntries();

      if (!records) {
        throw new Error("No records found");
      }

      const reducedRecords = groupByAppName(records);

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
