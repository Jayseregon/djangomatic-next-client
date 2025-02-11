"use client";

import React from "react";
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
import { useAppTrackingData } from "@/src/hooks/useAppTrackingData";

export const AppTrackingBoard = () => {
  const t = useTranslations("RnD.appTracking.boardColumns");
  const { data, isLoading, error, reload } = useAppTrackingData();

  if (error) {
    throw new Error(error);
  }

  const topContent = () => {
    return (
      <div className="flex justify-left items-center">
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
          selectionMode="single"
          topContent={topContent()}
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
            {data.map((track) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
