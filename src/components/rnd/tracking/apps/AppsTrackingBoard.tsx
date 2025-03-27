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
} from "@heroui/react";

import { LoadingContent } from "@/components/ui/LoadingContent";
import { AppGroup, AppsTrackingBoardProps } from "@/interfaces/rnd";
import { BoardTopContent } from "@/components/rnd/tracking/BoardTopContent";

import { MonthlyAppsUsageBoard } from "./MonthlyAppsUsageBoard";

export const AppsTrackingBoard = ({
  data,
  isLoading,
  error,
  reload,
  selectedYear,
}: AppsTrackingBoardProps) => {
  const t = useTranslations("RnD.appTracking.boardColumns");
  const [selectedItem, setSelectedItem] = useState<AppGroup | null>(null);

  if (error) {
    throw new Error(error);
  }

  const handleSelectionChange = (key: React.Key) => {
    const item = data.find((item) => item.id === key);

    setSelectedItem(item || null);
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
          topContent={BoardTopContent({ reload, selectedYear })}
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
          <MonthlyAppsUsageBoard item={selectedItem} />
        </div>
      )}
    </div>
  );
};
