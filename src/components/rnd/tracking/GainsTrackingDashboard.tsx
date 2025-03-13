"use client";

// import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { Tabs, Tab } from "@heroui/react";

import { GainsTrackingBoard } from "@/src/components/rnd/tracking/GainsTrackingBoard";
import { GainTrackingItem } from "@/src/interfaces/rnd";

// Mock data
const mockData: GainTrackingItem[] = [
  {
    id: "1",
    name: "Invoice Processing Automation",
    timeSaved: 25,
    costSavings: 5000,
    roi: 180,
    implementationDate: "2023-06-15",
    status: "Completed",
    department: "Finance",
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
  },
];

// Client component that uses session
export const GainsTrackingDashboard = () => {
  //   const t = useTranslations("RnD.gainsTracking");

  // Get all available years from the data
  const availableYears = useMemo(() => {
    const years = new Set(
      mockData.map((item) => new Date(item.implementationDate).getFullYear()),
    );

    return Array.from(years).sort().reverse();
  }, []);

  // Default to current year or most recent year in data
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(
    availableYears.includes(currentYear) ? currentYear : availableYears[0],
  );

  // Filter data by selected year
  const filteredData = useMemo(() => {
    return mockData.filter(
      (item) =>
        new Date(item.implementationDate).getFullYear() === selectedYear,
    );
  }, [selectedYear]);

  return (
    <>
      <div className="mt-8">
        <Tabs
          classNames={{
            tabList: "gap-6",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-2",
            tabContent: "group-data-[selected=true]:text-primary",
          }}
          color="primary"
          selectedKey={selectedYear.toString()}
          variant="underlined"
          onSelectionChange={(key) => setSelectedYear(Number(key))}
        >
          {availableYears.map((year) => (
            <Tab key={year.toString()} title={year.toString()} />
          ))}
        </Tabs>
      </div>
      <GainsTrackingBoard data={filteredData} />
    </>
  );
};
