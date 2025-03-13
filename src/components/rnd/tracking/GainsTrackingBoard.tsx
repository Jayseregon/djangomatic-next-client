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
import { GainTrackingItem } from "@/src/interfaces/rnd";
import { MonthlyGainsCostBoard } from "@/components/rnd/tracking/MonthlyGainsCostBoard";

export const GainsTrackingBoard = ({ data }: { data: GainTrackingItem[] }) => {
  const t = useTranslations("RnD.gainsTracking.boardColumns");
  const [selectedItem, setSelectedItem] = useState<GainTrackingItem | null>(
    null,
  );

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
          aria-label="rnd-gain-board"
          classNames={{
            base: "text-center",
            th: "uppercase bg-foreground text-background",
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
            <TableColumn key="name" allowsSorting className="text-center">
              {t("name")}
            </TableColumn>
            <TableColumn key="timeSaved" allowsSorting className="text-center">
              Time Saved (hrs/week)
            </TableColumn>
            <TableColumn
              key="costSavings"
              allowsSorting
              className="text-center"
            >
              Cost Savings ($/mo)
            </TableColumn>
            <TableColumn key="roi" allowsSorting className="text-center">
              ROI (%)
            </TableColumn>
            <TableColumn
              key="implementationDate"
              allowsSorting
              className="text-center"
            >
              Implementation Date
            </TableColumn>
            <TableColumn key="status" allowsSorting className="text-center">
              Status
            </TableColumn>
            <TableColumn key="department" allowsSorting className="text-center">
              Department
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent="No entries found"
            items={data}
            loadingContent={<LoadingContent />}
          >
            {(item) => (
              <TableRow key={item.id}>
                <TableCell className="text-start text-nowrap">
                  {item.name}
                </TableCell>
                <TableCell>{item.timeSaved}</TableCell>
                <TableCell>${item.costSavings.toLocaleString()}</TableCell>
                <TableCell>{item.roi}%</TableCell>
                <TableCell>
                  {new Date(item.implementationDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : item.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>{item.department}</TableCell>
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
          <MonthlyGainsCostBoard item={selectedItem} />
        </div>
      )}
    </div>
  );
};
