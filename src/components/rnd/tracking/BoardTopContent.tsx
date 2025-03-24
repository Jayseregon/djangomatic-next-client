"use client";

import React from "react";
import { Button } from "@heroui/react";
import { RefreshCcw } from "lucide-react";

import { BoardTopContentProps } from "@/src/interfaces/rnd";

export const BoardTopContent = ({
  reload,
  selectedYear,
}: BoardTopContentProps) => {
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
