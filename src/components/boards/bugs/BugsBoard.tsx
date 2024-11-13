"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableCell,
  TableRow,
  Chip,
} from "@nextui-org/react";

import { useSortBugsList } from "@/hooks/useSortBugsList";
import { LoadingContent } from "@/components/ui/LoadingContent";
import { bugStatusColorMap, bugPriorityColorMap } from "@/lib/utils";

export const BugsBoard = ({
  bugsUpdated,
  topContent,
  handleRowAction,
  showCompleted = false,
}: {
  bugsUpdated: boolean;
  topContent: React.ReactNode;
  handleRowAction: (taskId: string) => void;
  showCompleted?: boolean;
}) => {
  const t = useTranslations("Boards.bugReport");
  const bugsList = useSortBugsList("/api/bug-report", showCompleted);

  useEffect(() => {
    bugsList.reload();
  }, [bugsUpdated]);

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
          sortDescriptor={bugsList.sortDescriptor}
          topContent={
            <div className="flex justify-end w-full">{topContent}</div>
          }
          onRowAction={(key) => handleRowAction(key.toString())}
          onSortChange={bugsList.sort}
        >
          <TableHeader>
            <TableColumn key="priority" allowsSorting className="text-center">
              {t("tableColumns.priority")}
            </TableColumn>
            <TableColumn key="bug" allowsSorting className="text-center">
              {t("tableColumns.title")}
            </TableColumn>
            <TableColumn key="description" className="text-center">
              {t("tableColumns.description")}
            </TableColumn>
            <TableColumn key="createdBy" allowsSorting className="text-center">
              {t("tableColumns.createdBy")}
            </TableColumn>
            <TableColumn key="status" allowsSorting className="text-center">
              {t("tableColumns.status")}
            </TableColumn>
            <TableColumn key="assignedTo" allowsSorting className="text-center">
              {t("tableColumns.assignedTo")}
            </TableColumn>
            <TableColumn key="comments" className="text-center">
              {t("tableColumns.comments")}
            </TableColumn>
            <TableColumn
              key="createdDate"
              allowsSorting
              className="text-center"
            >
              {t("tableColumns.createdDate")}
            </TableColumn>
            <TableColumn
              key="assignedDate"
              allowsSorting
              className="text-center"
            >
              {t("tableColumns.assignedDate")}
            </TableColumn>
            <TableColumn
              key="completedDate"
              allowsSorting
              className="text-center"
            >
              {t("tableColumns.completedDate")}
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent="No entries found"
            isLoading={bugsList.isLoading}
            items={bugsList.items}
            loadingContent={<LoadingContent />}
          >
            {bugsList.items.map((bug) => {
              return (
                <TableRow key={bug.id}>
                  <TableCell className="text-center">
                    <Chip
                      className="capitalize"
                      color={bugPriorityColorMap[bug.priority]}
                      size="sm"
                      variant="flat"
                    >
                      {bug.priority.toLocaleLowerCase()}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-start">
                    <div className="max-w-xs text-wrap break-words">
                      {bug.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-start">
                    <div className="max-w-xs text-wrap break-words">
                      {bug.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-nowrap">
                    {bug.createdBy}
                  </TableCell>
                  <TableCell className="text-center">
                    <Chip
                      className="capitalize"
                      color={bugStatusColorMap[bug.status]}
                      size="sm"
                      variant="flat"
                    >
                      {bug.status.toLowerCase()}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-center text-nowrap">
                    {bug.assignedTo}
                  </TableCell>
                  <TableCell className="text-start">
                    <div className="max-w-xs text-wrap break-words">
                      {bug.comments}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-nowrap">
                    {bug.createdDate?.toLocaleDateString("en-CA", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-center text-nowrap">
                    {bug.assignedDate?.toLocaleDateString("en-CA", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-center text-nowrap">
                    {bug.completedDate?.toLocaleDateString("en-CA", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
