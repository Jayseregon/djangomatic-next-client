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
import { GainTrackingStatus } from "@prisma/client";
import { SquareCheck, SquareX } from "lucide-react";

import { LoadingContent } from "@/components/ui/LoadingContent";
import { GainsTrackingRecordItem } from "@/src/interfaces/rnd";
import { MonthlyGainsCostBoard } from "@/components/rnd/tracking/gains/MonthlyGainsCostBoard";

export const GainsTrackingBoard = ({
  data,
}: {
  data: GainsTrackingRecordItem[];
}) => {
  const t = useTranslations("RnD.gainsTracking.boardColumns");
  const [selectedItem, setSelectedItem] =
    useState<GainsTrackingRecordItem | null>(null);

  const handleSelectionChange = (key: React.Key) => {
    const item = data.find((item) => item.id === key);

    setSelectedItem(item || null);
  };

  // Split header text into multiple lines
  const splitHeader = (lines: string[]) => {
    return lines.map((line, index) => <div key={index}>{line}</div>);
  };

  const getStatusDisplay = (status: boolean) => {
    if (status) {
      return (
        <div className="flex items-center justify-center text-success w-full">
          <SquareCheck />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center text-danger w-full">
          <SquareX />
        </div>
      );
    }
  };

  // Map GainTrackingStatus to display values and styles
  const getGainStatusDisplay = (status: GainTrackingStatus) => {
    switch (status) {
      case GainTrackingStatus.CLOSED:
        return { label: "Closed", className: "bg-green-300 text-green-800" };
      case GainTrackingStatus.OPEN:
        return { label: "Open", className: "bg-blue-300 text-blue-800" };
      case GainTrackingStatus.CANCELLED:
        return {
          label: "Cancelled",
          className: "bg-yellow-300 text-yellow-800",
        };
      default:
        return { label: status, className: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <div className="mt-10 w-full">
      <div className="overflow-x-auto">
        <Table
          isHeaderSticky
          removeWrapper
          aria-label="rnd-gain-board"
          classNames={{
            base: "text-center",
            th: "uppercase bg-foreground text-background text-center",
          }}
          color="primary"
          selectedKeys={selectedItem ? [selectedItem.id] : []}
          selectionMode="single"
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
            <TableColumn key="name">{t("name")}</TableColumn>
            <TableColumn key="region">Region</TableColumn>
            <TableColumn key="hasGains">
              {splitHeader(["Has", "Gains"])}
            </TableColumn>
            <TableColumn key="replaceOffshore">
              {splitHeader(["Replace", "Offshore"])}
            </TableColumn>
            <TableColumn key="timeInitial">
              {splitHeader(["Initial", "Time (hrs)"])}
            </TableColumn>
            <TableColumn key="timeSaved">
              {splitHeader(["Saved", "Time (hrs)"])}
            </TableColumn>
            <TableColumn key="comments">Comments</TableColumn>
            <TableColumn key="status">Status</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent="No entries found"
            items={data}
            loadingContent={<LoadingContent />}
          >
            {(item) => (
              <TableRow key={item.id}>
                <TableCell className="max-w-60 truncate text-start text-nowrap">
                  {item.name}
                </TableCell>
                <TableCell>{item.region}</TableCell>
                <TableCell className="text-center">
                  {getStatusDisplay(item.hasGains)}
                </TableCell>
                <TableCell className="text-center">
                  {getStatusDisplay(item.replaceOffshore)}
                </TableCell>
                <TableCell className="text-center">
                  {item.timeInitial}
                </TableCell>
                <TableCell className="text-center">{item.timeSaved}</TableCell>
                <TableCell className="max-w-60 truncate text-start text-nowrap">
                  {item.comments || "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      getGainStatusDisplay(item.status).className
                    }`}
                  >
                    {getGainStatusDisplay(item.status).label}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedItem && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">
            Monthly Costs for {selectedItem.name}
          </h3>
          <MonthlyGainsCostBoard record={selectedItem} />
        </div>
      )}
    </div>
  );
};
