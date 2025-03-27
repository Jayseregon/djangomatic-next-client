"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableCell,
  TableRow,
  Chip,
  SortDescriptor,
} from "@heroui/react";

import { useSortTasksList } from "@/hooks/useSortTasksList";
import { LoadingContent } from "@/components/ui/LoadingContent";
import { UserSchema } from "@/interfaces/lib";
import { title } from "@/components/primitives";
import { statusColorMap, taskDueDateColor } from "@/lib/utils";
import { getRndUserById } from "@/src/actions/prisma/rndTask/action";

export const TaskBoardShort = ({
  user,
  taskUpdated,
  topContent,
  handleRowAction,
  showCompleted = false,
}: {
  user: UserSchema;
  taskUpdated: boolean;
  topContent: React.ReactNode;
  handleRowAction: (taskId: string) => void;
  showCompleted?: boolean;
}) => {
  // Pass user.id directly to useSortTasksList instead of an API endpoint URL
  const tasksList = useSortTasksList(user.id, showCompleted);
  const t = useTranslations("RnD");

  useEffect(() => {
    tasksList.reload();
  }, [user, taskUpdated]);

  const handleSortChange = (sortDescriptor: SortDescriptor) => {
    tasksList.sort({
      ...sortDescriptor,
      column: sortDescriptor.column ?? "id",
      direction: sortDescriptor.direction ?? "ascending",
    });
  };

  return (
    <div className="mt-10 w-11/12">
      <div className="overflow-x-auto">
        <Table
          isHeaderSticky
          removeWrapper
          aria-label="rnd-task-board"
          classNames={{
            base: "text-left",
            th: "uppercase bg-foreground text-background",
          }}
          color="primary"
          selectionMode="single"
          sortDescriptor={tasksList.sortDescriptor}
          topContent={
            <div className="flex justify-between items-center w-full text-xl font-semibold">
              <p>{user.name}</p>
              {topContent}
            </div>
          }
          onRowAction={(key) => handleRowAction(key.toString())}
          onSortChange={handleSortChange}
        >
          <TableHeader>
            <TableColumn key="task" allowsSorting className="text-center">
              {t("taskBoardColumns.task")}
            </TableColumn>
            <TableColumn key="status" allowsSorting className="text-center">
              {t("taskBoardColumns.status")}
            </TableColumn>
            <TableColumn key="priority" allowsSorting className="text-center">
              {t("taskBoardColumns.priority")}
            </TableColumn>
            <TableColumn key="dueDate" allowsSorting className="text-center">
              {t("taskBoardColumns.dueDate")}
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent="No entries found"
            isLoading={tasksList.isLoading}
            items={tasksList.items}
            loadingContent={<LoadingContent />}
          >
            {tasksList.items.map((task) => {
              // Determine background color based on dueDate
              const rowBgColor =
                task.dueDate && !showCompleted
                  ? taskDueDateColor(task.dueDate)
                  : "";

              return (
                <TableRow key={task.id} className={rowBgColor}>
                  <TableCell className="text-start">
                    <div className="max-w-xs text-wrap break-words">
                      {task.task}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Chip
                      className="capitalize"
                      color={statusColorMap[task.status]}
                      size="sm"
                      variant="flat"
                    >
                      {task.status.toLowerCase()}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-center">{task.priority}</TableCell>
                  <TableCell className="text-center text-nowrap">
                    {task.dueDate?.toLocaleDateString("en-CA", {
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

export const TaskBoardFull = ({
  id,
  taskUpdated,
  topContent,
  handleRowAction,
  showCompleted = false,
}: {
  id: string;
  taskUpdated: boolean;
  topContent: React.ReactNode;
  handleRowAction: (taskId: string) => void;
  showCompleted?: boolean;
}) => {
  const [user, setUser] = useState<UserSchema>({} as UserSchema);
  const t = useTranslations("RnD");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRndUserById(id);

        setUser(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
    fetchData();
  }, [id]);

  // Pass id directly to useSortTasksList instead of an API endpoint URL
  const tasksList = useSortTasksList(id, showCompleted);

  useEffect(() => {
    tasksList.reload();
  }, [id, taskUpdated]);

  const handleSortChange = (sortDescriptor: SortDescriptor) => {
    tasksList.sort({
      ...sortDescriptor,
      column: sortDescriptor.column ?? "id",
      direction: sortDescriptor.direction ?? "ascending",
    });
  };

  return (
    <>
      {!showCompleted ? (
        <div className="flex flex-col">
          <h1 className={title()}>{user.name}</h1>
          <h2 className={title({ size: "xs" })}>{t("taskExtension")}</h2>
        </div>
      ) : null}

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
            sortDescriptor={tasksList.sortDescriptor}
            topContent={
              <div className="flex justify-end w-full">{topContent}</div>
            }
            onRowAction={(key) => handleRowAction(key.toString())}
            onSortChange={handleSortChange}
          >
            <TableHeader>
              <TableColumn key="created" allowsSorting className="text-center">
                {t("taskBoardColumns.created")}
              </TableColumn>
              <TableColumn key="task" allowsSorting className="text-center">
                {t("taskBoardColumns.task")}
              </TableColumn>
              <TableColumn key="status" allowsSorting className="text-center">
                {t("taskBoardColumns.status")}
              </TableColumn>
              <TableColumn key="priority" allowsSorting className="text-center">
                {t("taskBoardColumns.priority")}
              </TableColumn>
              <TableColumn
                key="impactedPeople"
                allowsSorting
                className="text-center"
              >
                {t("taskBoardColumns.impacted")}
              </TableColumn>
              <TableColumn key="comment" className="text-center">
                {t("taskBoardColumns.comments")}
              </TableColumn>
              <TableColumn key="dueDate" allowsSorting className="text-center">
                {t("taskBoardColumns.dueDate")}
              </TableColumn>
              <TableColumn
                key="startedAt"
                allowsSorting
                className="text-center"
              >
                {t("taskBoardColumns.startedAt")}
              </TableColumn>
              <TableColumn
                key="completedAt"
                allowsSorting
                className="text-center"
              >
                {t("taskBoardColumns.completedAt")}
              </TableColumn>
            </TableHeader>
            <TableBody
              emptyContent="No entries found"
              isLoading={tasksList.isLoading}
              items={tasksList.items}
              loadingContent={<LoadingContent />}
            >
              {tasksList.items.map((task) => {
                // Determine background color based on dueDate
                const rowBgColor =
                  task.dueDate && !showCompleted
                    ? taskDueDateColor(task.dueDate)
                    : "";

                return (
                  <TableRow key={task.id} className={rowBgColor}>
                    <TableCell className="text-center text-nowrap">
                      {task.createdAt?.toLocaleDateString("en-CA", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-start">
                      <div className="max-w-xs text-wrap break-words">
                        {task.task}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Chip
                        className="capitalize"
                        color={statusColorMap[task.status]}
                        size="sm"
                        variant="flat"
                      >
                        {task.status.toLowerCase()}
                      </Chip>
                    </TableCell>
                    <TableCell className="text-center">
                      {task.priority}
                    </TableCell>
                    <TableCell className="text-center">
                      {task.impactedPeople}
                    </TableCell>
                    <TableCell className="text-start">
                      <div className="max-w-xs text-wrap break-words">
                        {task.comment}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-nowrap">
                      {task.dueDate?.toLocaleDateString("en-CA", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-center text-nowrap">
                      {task.startedAt?.toLocaleDateString("en-CA", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-center text-nowrap">
                      {task.completedAt?.toLocaleDateString("en-CA", {
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
    </>
  );
};
