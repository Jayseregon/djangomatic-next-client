import { FiscalMonths } from "@prisma/client";

/**
 * Get fiscal month from a date
 */
export function getFiscalMonth(date: Date): FiscalMonths {
  const month = date.getMonth();
  // Map JavaScript months (0-11) to FiscalMonths enum
  const fiscalMonthMap: Record<number, FiscalMonths> = {
    0: FiscalMonths.January,
    1: FiscalMonths.February,
    2: FiscalMonths.March,
    3: FiscalMonths.April,
    4: FiscalMonths.May,
    5: FiscalMonths.June,
    6: FiscalMonths.July,
    7: FiscalMonths.August,
    8: FiscalMonths.September,
    9: FiscalMonths.October,
    10: FiscalMonths.November,
    11: FiscalMonths.December,
  };

  return fiscalMonthMap[month];
}

/**
 * Get fiscal year from a date (Dec is part of next fiscal year)
 */
export function getFiscalYear(date: Date): number {
  const month = date.getMonth();
  const year = date.getFullYear();

  // If it's December (month 11), it's part of the next fiscal year
  return month === 11 ? year + 1 : year;
}
