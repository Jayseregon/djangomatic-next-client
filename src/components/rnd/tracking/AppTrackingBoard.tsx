"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableCell,
  TableRow,
  Button,
} from "@heroui/react";
import { RefreshCcw } from "lucide-react";

import { LoadingContent } from "@/components/ui/LoadingContent";
import { AppGroup } from "@/src/interfaces/rnd";

import { MonthlyAppUsageBoard } from "./MonthlyAppUsageBoard";

interface AppTrackingBoardProps {
  data: AppGroup[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
  selectedYear?: number;
}

export const AppTrackingBoard = ({
  data,
  isLoading,
  error,
  reload,
  selectedYear,
}: AppTrackingBoardProps) => {
  const t = useTranslations("RnD.appTracking.boardColumns");
  const [selectedItem, setSelectedItem] = useState<AppGroup | null>(null);

  if (error) {
    throw new Error(error);
  }

  const handleSelectionChange = (key: React.Key) => {
    const item = data.find((item) => item.id === key);

    setSelectedItem(item || null);
  };

  const topContent = () => {
    return (
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            isIconOnly
            color="primary"
            onPress={() => {
              reload();
            }}
          >
            <RefreshCcw />
          </Button>
        </div>
        {selectedYear && (
          <div className="text-lg font-medium">
            Showing data for {selectedYear}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-10 w-full">
      <div className="overflow-x-auto">
        <Table
          isHeaderSticky
          removeWrapper
          aria-label="rnd-task-board"
          classNames={{
            base: "text-center",
            th: "uppercase bg-foreground text-background",
          }}
          color="primary"
          selectedKeys={selectedItem ? [selectedItem.id] : []}
          selectionMode="single"
          topContent={topContent()}
          onSelectionChange={(keys) => {
            // The keys is a Set, we need to get the first (and only) key
            if (keys === "all") return;
            const keyArray = Array.from(keys);

            if (keyArray.length > 0) {
              handleSelectionChange(keyArray[0]);
            } else {
              setSelectedItem(null);
            }
          }}
        >
          <TableHeader>
            <TableColumn key="app-name" allowsSorting className="text-center">
              {t("appName")}
            </TableColumn>
            <TableColumn
              key="usage-count"
              allowsSorting
              className="text-center"
            >
              {t("usageCount")}
            </TableColumn>
            <TableColumn key="endpoint" className="text-center">
              {t("endpoint")}
            </TableColumn>
            <TableColumn key="avg-time" className="text-center">
              {t("average")}
            </TableColumn>
            <TableColumn key="min-time" className="text-center">
              {t("min")}
            </TableColumn>
            <TableColumn key="max-time" className="text-center">
              {t("max")}
            </TableColumn>
            <TableColumn key="total-time" className="text-center">
              {t("total")}
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent="No entries found"
            isLoading={isLoading}
            items={data}
            loadingContent={<LoadingContent />}
          >
            {(track) => (
              <TableRow key={track.id}>
                <TableCell className="text-start text-nowrap">
                  {track.app_name}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {track.count}
                </TableCell>
                <TableCell className="text-start text-nowrap">
                  {track.endpoint}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {track.avg_time}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {track.min_time}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {track.max_time}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {track.total_time}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedItem && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">
            Monthly Usage for {selectedItem.app_name}
            {selectedYear ? ` (${selectedYear})` : ""}
          </h3>
          <MonthlyAppUsageBoard item={selectedItem} />
        </div>
      )}
    </div>
  );
};
