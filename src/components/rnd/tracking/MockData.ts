import { GainTrackingItem } from "@/src/interfaces/rnd";
import { getFiscalMonths } from "@/components/rnd/tracking/getFiscalMonths";

// Helper function to generate monthly costs
export const generateMonthlyCosts = (startDate: string, baseCost: number) => {
  const startDateObj = new Date(startDate);
  const implementationMonth = startDateObj.getMonth(); // 0-11

  // Find the fiscal month index (December = 0, January = 1, etc.)
  // We need to convert from calendar month (Jan=0) to fiscal month (Dec=0)
  const fiscalMonthIndex = (implementationMonth + 1) % 12;

  return getFiscalMonths.map((month, index) => {
    // Only show costs for months after or equal to implementation month
    const cost =
      index >= fiscalMonthIndex
        ? Math.round(baseCost * (0.8 + Math.random() * 0.4))
        : 0;

    return {
      month,
      cost,
    };
  });
};

export const mockData: GainTrackingItem[] = [
  {
    id: "1",
    name: "Invoice Processing Automation",
    timeSaved: 25,
    costSavings: 5000,
    roi: 180,
    implementationDate: "2023-06-15",
    status: "Completed",
    department: "Finance",
    monthlyCosts: generateMonthlyCosts("2023-06-15", 5000),
  },
  {
    id: "2",
    name: "Customer Support Chatbot",
    timeSaved: 40,
    costSavings: 8500,
    roi: 210,
    implementationDate: "2023-08-22",
    status: "Completed",
    department: "Customer Service",
    monthlyCosts: generateMonthlyCosts("2023-08-22", 8500),
  },
  {
    id: "3",
    name: "HR Onboarding System",
    timeSaved: 15,
    costSavings: 3200,
    roi: 150,
    implementationDate: "2023-10-10",
    status: "In Progress",
    department: "Human Resources",
    monthlyCosts: generateMonthlyCosts("2023-10-10", 3200),
  },
  {
    id: "4",
    name: "Inventory Management System",
    timeSaved: 30,
    costSavings: 12000,
    roi: 250,
    implementationDate: "2024-01-15",
    status: "In Progress",
    department: "Operations",
    monthlyCosts: generateMonthlyCosts("2024-01-15", 12000),
  },
  {
    id: "5",
    name: "Automated Test Suite",
    timeSaved: 20,
    costSavings: 7500,
    roi: 190,
    implementationDate: "2024-03-01",
    status: "Planned",
    department: "Development",
    monthlyCosts: generateMonthlyCosts("2024-03-01", 7500),
  },
  {
    id: "6",
    name: "Legacy System Migration",
    timeSaved: 35,
    costSavings: 15000,
    roi: 300,
    implementationDate: "2022-05-10",
    status: "Completed",
    department: "IT",
    monthlyCosts: generateMonthlyCosts("2022-05-10", 15000),
  },
  {
    id: "7",
    name: "Data Analytics Dashboard",
    timeSaved: 18,
    costSavings: 6200,
    roi: 175,
    implementationDate: "2022-09-22",
    status: "Completed",
    department: "Analytics",
    monthlyCosts: generateMonthlyCosts("2022-09-22", 6200),
  },
  {
    id: "8",
    name: "Tracking Automation",
    timeSaved: 25,
    costSavings: 3000,
    roi: 130,
    implementationDate: "2025-03-13",
    status: "In Progress",
    department: "Finance",
    monthlyCosts: generateMonthlyCosts("2025-03-13", 3000),
  },
];
