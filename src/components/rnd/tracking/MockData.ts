import { FiscalMonths, GainTrackingStatus } from "@prisma/client";

import { GainsTrackingRecordItem } from "@/src/interfaces/rnd";

// Generate mock GainsTrackingRecordItem data that matches the Prisma model
export const mockGainsRecords: GainsTrackingRecordItem[] = [
  {
    id: "1",
    createdAt: new Date("2025-05-10"),
    taskId: "task-1",
    name: "Invoice Processing Automation",
    region: "North America",
    hasGains: true,
    replaceOffshore: false,
    timeInitial: 40,
    timeSaved: 25,
    status: GainTrackingStatus.OPEN,
    monthlyCosts: [
      {
        id: "mc-1-1",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.June,
        cost: 5200, // (34 * 150) + 100
        count: 34,
        rate: 150,
        adjustedCost: 100,
      },
      {
        id: "mc-1-2",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.December,
        cost: 5500, // (35 * 150) + 250
        count: 35,
        rate: 150,
        adjustedCost: 250,
      },
      {
        id: "mc-1-3",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.January,
        cost: 4800, // (32 * 150) + 0
        count: 32,
        rate: 150,
        adjustedCost: 0,
      },
      {
        id: "mc-1-4",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.February,
        cost: 5400, // (36 * 150) + 0
        count: 36,
        rate: 150,
        adjustedCost: 0,
      },
      {
        id: "mc-1-5",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.March,
        cost: 5000, // (33 * 150) + 50
        count: 33,
        rate: 150,
        adjustedCost: 50,
      },
      {
        id: "mc-1-6",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.April,
        cost: 5200, // (34 * 150) + 100
        count: 34,
        rate: 150,
        adjustedCost: 100,
      },
      {
        id: "mc-1-7",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.March,
        cost: 5045, // (33 * 150) + 95
        count: 33,
        rate: 150,
        adjustedCost: 95,
      },
    ],
    comments: "Successfully automated invoice processing workflow",
  },
  {
    id: "2",
    createdAt: new Date("2025-08-15"),
    taskId: "task-2",
    name: "Customer Support Chatbot",
    region: "Global",
    hasGains: true,
    replaceOffshore: true,
    timeInitial: 60,
    timeSaved: 40,
    status: GainTrackingStatus.CLOSED,
    monthlyCosts: [
      {
        id: "mc-2-1",
        gainsRecordId: "2",
        fiscalYear: 2025,
        month: FiscalMonths.August,
        cost: 9000, // (85 * 100) + 500
        count: 85,
        rate: 100,
        adjustedCost: 500,
      },
      {
        id: "mc-2-2",
        gainsRecordId: "2",
        fiscalYear: 2025,
        month: FiscalMonths.September,
        cost: 8600, // (83 * 100) + 300
        count: 83,
        rate: 100,
        adjustedCost: 300,
      },
      {
        id: "mc-2-3",
        gainsRecordId: "2",
        fiscalYear: 2025,
        month: FiscalMonths.October,
        cost: 9400, // (87 * 100) + 700
        count: 87,
        rate: 100,
        adjustedCost: 700,
      },
      {
        id: "mc-2-4",
        gainsRecordId: "2",
        fiscalYear: 2025,
        month: FiscalMonths.November,
        cost: 8600, // (86 * 100) + 0
        count: 86,
        rate: 100,
        adjustedCost: 0,
      },
      {
        id: "mc-2-5",
        gainsRecordId: "2",
        fiscalYear: 2025,
        month: FiscalMonths.July,
        cost: 8400, // (84 * 100) + 0
        count: 84,
        rate: 100,
        adjustedCost: 0,
      },
    ],
  },
  {
    id: "3",
    createdAt: new Date("2024-10-01"),
    taskId: "task-3",
    name: "HR Onboarding System",
    region: "Europe",
    hasGains: true,
    replaceOffshore: false,
    timeInitial: 25,
    timeSaved: 15,
    status: GainTrackingStatus.OPEN,
    monthlyCosts: [
      {
        id: "mc-3-1",
        gainsRecordId: "3",
        fiscalYear: 2024,
        month: FiscalMonths.October,
        cost: 3400, // (40 * 80) + 200
        count: 40,
        rate: 80,
        adjustedCost: 200,
      },
      {
        id: "mc-3-2",
        gainsRecordId: "3",
        fiscalYear: 2024,
        month: FiscalMonths.November,
        cost: 3120, // (39 * 80) + 0
        count: 39,
        rate: 80,
        adjustedCost: 0,
      },
      {
        id: "mc-3-3",
        gainsRecordId: "3",
        fiscalYear: 2024,
        month: FiscalMonths.September,
        cost: 3280, // (41 * 80) + 0
        count: 41,
        rate: 80,
        adjustedCost: 0,
      },
      {
        id: "mc-3-4",
        gainsRecordId: "4",
        fiscalYear: 2024,
        month: FiscalMonths.July,
        cost: 3080, // (38 * 80) + 40
        count: 38,
        rate: 80,
        adjustedCost: 40,
      },
    ],
  },
  {
    id: "4",
    createdAt: new Date("2024-01-05"),
    taskId: "task-4",
    name: "Inventory Management System",
    region: "APAC",
    hasGains: true,
    replaceOffshore: true,
    timeInitial: 45,
    timeSaved: 30,
    status: GainTrackingStatus.OPEN,
    monthlyCosts: [
      {
        id: "mc-4-1",
        gainsRecordId: "4",
        fiscalYear: 2024,
        month: FiscalMonths.January,
        cost: 12000, // (60 * 200) + 0
        count: 60,
        rate: 200,
        adjustedCost: 0,
      },
      {
        id: "mc-4-2",
        gainsRecordId: "4",
        fiscalYear: 2024,
        month: FiscalMonths.February,
        cost: 11800, // (59 * 200) + 0
        count: 59,
        rate: 200,
        adjustedCost: 0,
      },
      {
        id: "mc-4-3",
        gainsRecordId: "4",
        fiscalYear: 2024,
        month: FiscalMonths.March,
        cost: 12400, // (61 * 200) + 200
        count: 61,
        rate: 200,
        adjustedCost: 200,
      },
    ],
  },
  {
    id: "5",
    createdAt: new Date("2025-03-18"),
    taskId: "task-5",
    name: "Gains board",
    region: "Atlantic",
    hasGains: true,
    replaceOffshore: true,
    timeInitial: 140,
    timeSaved: 25,
    status: GainTrackingStatus.OPEN,
    monthlyCosts: [
      {
        id: "mc-3-1",
        gainsRecordId: "3",
        fiscalYear: 2024,
        month: FiscalMonths.December,
        cost: 3400, // (40 * 80) + 200
        count: 40,
        rate: 80,
        adjustedCost: 200,
      },
      {
        id: "mc-1-1",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.January,
        cost: 5100, // (34 * 150) + 0
        count: 34,
        rate: 150,
        adjustedCost: 0,
      },
      {
        id: "mc-1-2",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.February,
        cost: 5250, // (35 * 150) + 0
        count: 35,
        rate: 150,
        adjustedCost: 0,
      },
      {
        id: "mc-1-3",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.March,
        cost: 5600, // (32 * 150) + 800
        count: 32,
        rate: 150,
        adjustedCost: 800,
      },
      {
        id: "mc-1-4",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.April,
        cost: 5400, // (36 * 150) + 0
        count: 36,
        rate: 150,
        adjustedCost: 0,
      },
      {
        id: "mc-1-5",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.May,
        cost: 5000, // (33 * 150) + 50
        count: 33,
        rate: 150,
        adjustedCost: 50,
      },
      {
        id: "mc-1-6",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.June,
        cost: 5200, // (34 * 150) + 100
        count: 34,
        rate: 150,
        adjustedCost: 100,
      },
      {
        id: "mc-1-7",
        gainsRecordId: "1",
        fiscalYear: 2025,
        month: FiscalMonths.July,
        cost: 5900, // (33 * 150) + 950
        count: 33,
        rate: 150,
        adjustedCost: 950,
      },
      {
        id: "mc-2-17",
        gainsRecordId: "2",
        fiscalYear: 2025,
        month: FiscalMonths.August,
        cost: 9000, // (85 * 100) + 500
        count: 85,
        rate: 100,
        adjustedCost: 500,
      },
      {
        id: "mc-4-1",
        gainsRecordId: "4",
        fiscalYear: 2024,
        month: FiscalMonths.September,
        cost: 12000, // (60 * 200) + 0
        count: 60,
        rate: 200,
        adjustedCost: 0,
      },
      {
        id: "mc-4-2",
        gainsRecordId: "4",
        fiscalYear: 2024,
        month: FiscalMonths.October,
        cost: 11800, // (59 * 200) + 0
        count: 59,
        rate: 200,
        adjustedCost: 0,
      },
      {
        id: "mc-4-3",
        gainsRecordId: "4",
        fiscalYear: 2024,
        month: FiscalMonths.November,
        cost: 12320, // (61 * 200) + 120
        count: 61,
        rate: 200,
        adjustedCost: 120,
      },
    ],
    comments: "Successfully automated invoice processing workflow",
  },
];
