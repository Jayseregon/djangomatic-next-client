import { FiscalMonths } from "@prisma/client";

import {
  getFiscalMonths,
  getFiscalMonthDisplayName,
  getFiscalMonthIndex,
} from "@/src/components/rnd/tracking/getFiscalMonths";

describe("getFiscalMonths", () => {
  it("should return an array of all fiscal months in the correct order", () => {
    // Expected fiscal year order (starts with December)
    const expectedOrder = [
      "December",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
    ];

    // Verify the array matches the expected values and order
    expect(getFiscalMonths).toEqual(expectedOrder);
  });

  it("should contain all months from the FiscalMonths enum", () => {
    // Get all values from the FiscalMonths enum
    const enumValues = Object.values(FiscalMonths);

    // Verify all enum values are in the array
    enumValues.forEach((month) => {
      expect(getFiscalMonths).toContain(month);
    });

    // Verify lengths are the same (no missing or extra months)
    expect(getFiscalMonths.length).toBe(enumValues.length);
  });
});

describe("getFiscalMonthDisplayName", () => {
  it("should return the correct display name for each fiscal month", () => {
    // Test each month
    Object.values(FiscalMonths).forEach((month) => {
      const displayName = getFiscalMonthDisplayName(month);

      expect(displayName).toBe(month);
    });
  });

  it("should handle all possible enum values", () => {
    // Make sure all enum values are handled
    const allHandled = Object.values(FiscalMonths).every(
      (month) => getFiscalMonthDisplayName(month) === month,
    );

    expect(allHandled).toBe(true);
  });
});

describe("getFiscalMonthIndex", () => {
  it("should return the correct index for each fiscal month", () => {
    // Test specific months with known indices
    expect(getFiscalMonthIndex(FiscalMonths.December)).toBe(0);
    expect(getFiscalMonthIndex(FiscalMonths.January)).toBe(1);
    expect(getFiscalMonthIndex(FiscalMonths.June)).toBe(6);
    expect(getFiscalMonthIndex(FiscalMonths.November)).toBe(11);
  });

  it("should return indices in sequential order", () => {
    // All 12 months should have sequential indices from 0-11
    const indices = Object.values(FiscalMonths).map(getFiscalMonthIndex);

    // Check if indices are sequential from 0 to 11
    const expectedIndices = Array.from({ length: 12 }, (_, i) => i);

    expect(indices).toEqual(expectedIndices);
  });

  it("should match the index in the getFiscalMonths array", () => {
    // The index should match the position in the array
    Object.values(FiscalMonths).forEach((month) => {
      const index = getFiscalMonthIndex(month);

      expect(getFiscalMonths[index]).toBe(month);
    });
  });
});

describe("Fiscal months integration", () => {
  it("should have December as first fiscal month", () => {
    expect(getFiscalMonths[0]).toBe(FiscalMonths.December);
    expect(getFiscalMonthIndex(FiscalMonths.December)).toBe(0);
  });

  it("should have November as last fiscal month", () => {
    expect(getFiscalMonths[11]).toBe(FiscalMonths.November);
    expect(getFiscalMonthIndex(FiscalMonths.November)).toBe(11);
  });

  it("should maintain consistency between functions", () => {
    // Verify that the display name of the month at index i
    // is the same as getting the display name directly
    getFiscalMonths.forEach((month, index) => {
      const directMonth = month;
      const displayName = getFiscalMonthDisplayName(month as FiscalMonths);
      const fetchedIndex = getFiscalMonthIndex(month as FiscalMonths);

      expect(displayName).toBe(directMonth);
      expect(fetchedIndex).toBe(index);
    });
  });
});
