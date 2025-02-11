export interface AppUsageTracking {
  id: string;
  task_id: string;
  app_name: string;
  endpoint: string;
  status: string;
  elapsed_time: string;
  createdAt: Date;
}

export interface AppGroup {
  app_name: string;
  count: number;
  min_time: string;
  max_time: string;
  avg_time: string;
  total_time: string;
  id: string;
  endpoint: string;
}
