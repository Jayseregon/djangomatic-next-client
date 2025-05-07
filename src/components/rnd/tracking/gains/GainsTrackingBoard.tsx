"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableCell,
  TableRow,
  useDisclosure,
  Button,
} from "@heroui/react";
import { CircleCheckBig, CircleOff, Cog, Edit } from "lucide-react";

import { GainTrackingStatus } from "@/generated/client";
import { LoadingContent } from "@/components/ui/LoadingContent";
import {
  GainsTrackingBoardProps,
  GainsTrackingRecordItem,
  MonthlyCostUpdateDetails,
} from "@/src/interfaces/rnd";
import { MonthlyGainsCostBoard } from "@/components/rnd/tracking/gains/MonthlyGainsCostBoard";
import {
  updateGainsRecord,
  updateMonthlyCost,
} from "@/src/actions/prisma/tracking/action";
import { BoardTopContent } from "@/components/rnd/tracking/BoardTopContent";
import { EditGainsRecordModal } from "@/components/rnd/tracking/gains/EditGainsRecordModal";

export const GainsTrackingBoard = ({
  data,
  reload,
  selectedYear,
}: GainsTrackingBoardProps) => {
  const t = useTranslations("RnD.gainsTracking.boardColumns");
  const [selectedItem, setSelectedItem] =
    useState<GainsTrackingRecordItem | null>(null);
  const [localData, setLocalData] = useState<GainsTrackingRecordItem[]>(data);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingItem, setEditingItem] =
    useState<GainsTrackingRecordItem | null>(null);
  const {
    isOpen: isEditModalOpen,
    onOpen: openEditModal,
    onClose: closeEditModal,
  } = useDisclosure();

  // Update the component when data changes from props
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleSelectionChange = useCallback(
    (key: React.Key) => {
      const item = localData.find((item) => item.id === key);

      setSelectedItem(item || null);
    },
    [localData],
  );

  // Helper function to update monthly costs
  const createUpdatedCosts = useCallback(
    (
      costs: any[],
      recordId: string,
      month: string,
      newCost: number,
      details?: MonthlyCostUpdateDetails,
    ) => {
      const updatedCosts = [...costs];
      const costIndex = updatedCosts.findIndex((cost) => cost.month === month);

      if (costIndex >= 0) {
        // Update existing month
        updatedCosts[costIndex] = {
          ...updatedCosts[costIndex],
          cost: newCost,
          count: details?.count,
          rate: details?.rate,
          adjustedCost: details?.adjustedCost,
        };
      } else {
        // Add new month entry
        updatedCosts.push({
          id: `temp-${Date.now()}`,
          gainsRecordId: recordId,
          fiscalYear: new Date().getFullYear(),
          month: month as any,
          cost: newCost,
          count: details?.count,
          rate: details?.rate,
          adjustedCost: details?.adjustedCost,
        });
      }

      return updatedCosts;
    },
    [],
  );

  // Handle updating monthly costs
  const handleUpdateMonthlyCost = useCallback(
    async (
      month: string,
      newCost: number,
      details?: MonthlyCostUpdateDetails,
    ) => {
      if (!selectedItem) return;

      setIsUpdating(true);

      try {
        // Call server action to update the database
        await updateMonthlyCost(
          selectedItem.id,
          month,
          newCost,
          details?.count || 0,
          details?.rate || 0,
          details?.adjustedCost || 0,
        );

        // Optimistically update the local state
        setLocalData((prevData) => {
          return prevData.map((item) => {
            if (item.id !== selectedItem.id) return item;

            return {
              ...item,
              monthlyCosts: createUpdatedCosts(
                item.monthlyCosts,
                selectedItem.id,
                month,
                newCost,
                details,
              ),
            };
          });
        });

        // Update the selected item without a second state update
        setSelectedItem((prevSelected) => {
          if (!prevSelected || prevSelected.id !== selectedItem.id)
            return prevSelected;

          return {
            ...prevSelected,
            monthlyCosts: createUpdatedCosts(
              prevSelected.monthlyCosts,
              selectedItem.id,
              month,
              newCost,
              details,
            ),
          };
        });
      } catch (error) {
        console.error("Failed to update cost:", error);
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedItem, createUpdatedCosts],
  );

  // Add new function to handle opening the edit modal
  const handleOpenEditModal = useCallback(
    (item: GainsTrackingRecordItem) => {
      setEditingItem(item);
      openEditModal();
    },
    [openEditModal],
  );

  // Add new function to handle saving edited data
  const handleSaveEdit = useCallback(
    async (updatedData: Partial<GainsTrackingRecordItem>) => {
      if (!updatedData.id) return;

      try {
        // Call server action to update the database
        await updateGainsRecord(updatedData.id, {
          region: updatedData.region,
          hasGains: updatedData.hasGains,
          replaceOffshore: updatedData.replaceOffshore,
          timeInitial: updatedData.timeInitial,
          timeSaved: updatedData.timeSaved,
          comments: updatedData.comments,
          status: updatedData.status,
          taskOwner: updatedData.taskOwner,
        });

        // Optimistically update local state
        setLocalData((prevData) =>
          prevData.map((item) =>
            item.id === updatedData.id ? { ...item, ...updatedData } : item,
          ),
        );

        // Update selected item if it was the one being edited
        if (selectedItem && selectedItem.id === updatedData.id) {
          setSelectedItem((prev) =>
            prev ? { ...prev, ...updatedData } : null,
          );
        }

        closeEditModal();
      } catch (error) {
        console.error("Failed to update record:", error);
      }
    },
    [closeEditModal, selectedItem],
  );

  // Split header text into multiple lines
  const splitHeader = useCallback((lines: string[]) => {
    return lines.map((line, index) => <div key={index}>{line}</div>);
  }, []);

  const getStatusDisplay = useCallback((status: boolean) => {
    if (status) {
      return (
        <div className="flex items-center justify-center text-success w-full">
          <CircleCheckBig />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center text-danger w-full">
          <CircleOff />
        </div>
      );
    }
  }, []);

  // Map GainTrackingStatus to display values and styles
  const getGainStatusDisplay = useCallback((status: GainTrackingStatus) => {
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
  }, []);

  const renderTableRow = useCallback(
    (item: GainsTrackingRecordItem) => (
      <TableRow key={item.id}>
        <TableCell className="max-w-60 truncate text-start text-nowrap">
          {item.name}
        </TableCell>
        <TableCell className="max-w-60 truncate text-start text-nowrap">
          {item.taskOwner}
        </TableCell>
        <TableCell>{item.region}</TableCell>
        <TableCell className="text-center">
          {getStatusDisplay(item.hasGains)}
        </TableCell>
        <TableCell className="text-center">
          {getStatusDisplay(item.replaceOffshore)}
        </TableCell>
        <TableCell className="text-center">{item.timeInitial}</TableCell>
        <TableCell className="text-center">{item.timeSaved}</TableCell>
        <TableCell className="max-w-60 min-w-60 truncate text-start text-nowrap">
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
        <TableCell className="text-center">
          <Button
            isIconOnly
            aria-label="Edit record"
            color="primary"
            size="sm"
            variant="light"
            onPress={() => handleOpenEditModal(item)}
          >
            <Edit />
          </Button>
        </TableCell>
      </TableRow>
    ),
    [getStatusDisplay, getGainStatusDisplay, handleOpenEditModal],
  );

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
            <TableColumn key="name">{t("name")}</TableColumn>
            <TableColumn key="owner">{t("owner")}</TableColumn>
            <TableColumn key="region">Region</TableColumn>
            <TableColumn key="hasGains">
              {splitHeader(["Has", "Gains"])}
            </TableColumn>
            <TableColumn key="replaceOffshore">
              {splitHeader(["Replace", "Offshore"])}
            </TableColumn>
            <TableColumn key="timeInitial">
              {splitHeader(["Initial", "hrs"])}
            </TableColumn>
            <TableColumn key="timeSaved">
              {splitHeader(["Saved", "hrs"])}
            </TableColumn>
            <TableColumn key="comments">Comments</TableColumn>
            <TableColumn key="status">Status</TableColumn>
            <TableColumn key="actions">
              <Cog />
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent="No entries found"
            items={localData}
            loadingContent={<LoadingContent />}
          >
            {renderTableRow}
          </TableBody>
        </Table>
      </div>

      {selectedItem && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">
            Monthly Gains for {selectedItem.name}
          </h3>
          <MonthlyGainsCostBoard
            isLoading={isUpdating}
            record={selectedItem}
            onUpdateMonthlyCost={handleUpdateMonthlyCost}
          />
        </div>
      )}

      <EditGainsRecordModal
        isOpen={isEditModalOpen}
        record={editingItem}
        onClose={closeEditModal}
        onSave={handleSaveEdit}
      />
    </div>
  );
};
