"use client";

import { Tabs, Tab, Button } from "@heroui/react";
import { RefreshCw } from "lucide-react";

import { GainsTrackingBoard } from "@/src/components/rnd/tracking/gains/GainsTrackingBoard";
import { LoadingContent } from "@/components/ui/LoadingContent";
import { useGainsTrackingData } from "@/src/hooks/tracking/useGainsTrackingData";

export const GainsTrackingDashboard = () => {
  const {
    data,
    fiscalYears,
    selectedYear,
    setSelectedYear,
    isLoading,
    error,
    reload,
  } = useGainsTrackingData();

  if (isLoading) {
    return <LoadingContent />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-danger">Error loading data: {error}</div>
        <Button color="primary" onPress={reload}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

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
          {fiscalYears.map((year) => (
            <Tab key={year.toString()} title={year.toString()} />
          ))}
        </Tabs>
      </div>
      <GainsTrackingBoard
        data={data}
        reload={reload}
        selectedYear={selectedYear}
      />
    </>
  );
};
