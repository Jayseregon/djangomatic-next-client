import { FiscalMonths } from "@/generated/client";

// List of fiscal months in fiscal year order
export const getFiscalMonths = Object.values(FiscalMonths);

// Helper function to convert FiscalMonths enum to display string
export const getFiscalMonthDisplayName = (month: FiscalMonths): string => {
  return month;
};

// Helper to get the fiscal month index (0-11)
export const getFiscalMonthIndex = (month: FiscalMonths): number => {
  return getFiscalMonths.indexOf(month);
};
