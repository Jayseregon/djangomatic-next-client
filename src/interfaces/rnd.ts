import { FiscalMonths, GainTrackingStatus } from "@prisma/client";
import { ReactNode } from "react";

import { TowerReport } from "@/interfaces/reports";

export interface GainsTrackingRecordItem {
  id: string;
  createdAt: Date;
  taskId: string;
  name: string;
  region?: string;
  hasGains: boolean;
  replaceOffshore: boolean;
  timeInitial: number;
  timeSaved: number;
  comments?: string;
  status: GainTrackingStatus;
  monthlyCosts: MonthlyCostRecordItem[];
}

export interface MonthlyCostRecordItem {
  id: string;
  gainsRecordId: string;
  fiscalYear: number;
  month: FiscalMonths;
  cost: number;
  count?: number;
  rate?: number;
  adjustedCost?: number;
}

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
  monthlyUsage?: {
    month: string;
    count: number;
  }[];
}

export interface AppsTrackingBoardProps {
  data: AppGroup[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
  selectedYear?: number;
}

// Define a type that picks only the fields we need from TowerReport
export type TowerReportForTracking = Pick<
  TowerReport,
  "id" | "createdAt" | "updatedAt"
>;

export interface MonthlyReportsUsageBoardProps {
  data: { month: string; count: number }[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
  selectedYear?: number;
  totalCount: number;
}

export interface MonthlyData {
  month: FiscalMonths | string;
  [key: string]: any;
}

export interface MonthlyDataTableProps {
  data: MonthlyData[];
  valueField?: string;
  valueFormat?: (value: number) => string;
  total: number;
  totalFormat?: (value: number) => string;
  isLoading?: boolean;
  loadingContent?: ReactNode;
  emptyContent?: string;
  tableAriaLabel?: string;
  tableStyles?: {
    base?: string;
    header?: string;
  };
  topContent?: ReactNode;
  onCellClick?: (cellData: {
    month: string;
    value: number;
    originalData: any;
  }) => void;
  isCellEditable?: boolean;
}

export interface MonthlyCostUpdateDetails {
  count: number;
  rate: number;
  adjustedCost: number;
}

export interface CellEditData {
  month: string;
  value: number;
  originalData: MonthlyData;
}

export interface MonthlyGainsCostBoardProps {
  record: GainsTrackingRecordItem;
  onUpdateMonthlyCost?: (
    month: string,
    newCost: number,
    details: MonthlyCostUpdateDetails,
  ) => void;
  isLoading?: boolean;
}
