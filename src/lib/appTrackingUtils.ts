import { AppGroup, AppUsageTracking } from "@/interfaces/rnd";
import { TowerReport } from "@/interfaces/reports";

type GroupData = {
  count: number;
  total_time: number;
  min_time: number;
  max_time: number;
  id: string;
  endpoint: string;
};

export const groupByAppName = (records: AppUsageTracking[]): AppGroup[] => {
  const groups = records.reduce(
    (acc, record) => {
      const time = parseFloat(record.elapsed_time.replace("s", ""));

      if (acc[record.app_name]) {
        // Throw error if endpoint is inconsistent
        if (acc[record.app_name].endpoint !== record.endpoint) {
          throw new Error(
            `Inconsistent endpoint for app '${record.app_name}'.`,
          );
        }
        acc[record.app_name].count++;
        acc[record.app_name].total_time += time;
        acc[record.app_name].min_time = Math.min(
          acc[record.app_name].min_time,
          time,
        );
        acc[record.app_name].max_time = Math.max(
          acc[record.app_name].max_time,
          time,
        );
      } else {
        acc[record.app_name] = {
          count: 1,
          total_time: time,
          min_time: time,
          max_time: time,
          id: record.id,
          endpoint: record.endpoint,
        };
      }

      return acc;
    },
    {} as Record<string, GroupData>,
  );

  return Object.entries(groups).map(([app_name, data]) => {
    const avg = data.total_time / data.count;

    return {
      app_name,
      id: data.id,
      count: data.count,
      total_time: `${data.total_time}s`,
      min_time: `${data.min_time}s`,
      max_time: `${data.max_time}s`,
      avg_time: `${avg.toFixed(2)}s`,
      endpoint: data.endpoint,
    };
  });
};

export const groupPciReports = (records: TowerReport[]): AppGroup[] => {
  const count = records.length;

  return [
    {
      app_name: "PCI Reports",
      id: "N/A",
      count: count,
      total_time: "N/A",
      min_time: "N/A",
      max_time: "N/A",
      avg_time: "N/A",
      endpoint: "/reports",
    },
  ];
};
