"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableCell,
  TableRow,
  Chip,
} from "@nextui-org/react";

import { useSortTasksList } from "@/hooks/useSortTasksList";
import { LoadingContent } from "@/components/ui/LoadingContent";
import { UserSchema } from "@/interfaces/lib";
import { title } from "@/components/primitives";
import { statusColorMap } from "@/lib/utils";

export const TaskBoardShort = ({
  user,
  taskUpdated,
  topContent,
  handleRowAction,
}: {
  user: UserSchema;
  taskUpdated: boolean;
  topContent: React.ReactNode;
  handleRowAction: (taskId: string) => void;
}) => {
  const tasksList = useSortTasksList(`/api/rnd-task?id=${user.id}`);

  useEffect(() => {
    tasksList.reload();
  }, [user, taskUpdated]);

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
          onSortChange={tasksList.sort}
        >
          <TableHeader>
            <TableColumn key="task" allowsSorting className="text-center">
              task
            </TableColumn>
            <TableColumn key="status" allowsSorting className="text-center">
              status
            </TableColumn>
            <TableColumn key="priority" allowsSorting className="text-center">
              priority
            </TableColumn>
            <TableColumn key="dueDate" allowsSorting className="text-center">
              due date
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent="No entries found"
            isLoading={tasksList.isLoading}
            items={tasksList.items}
            loadingContent={<LoadingContent />}
          >
            {tasksList.items.map((task) => (
              <TableRow key={task.id}>
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
            ))}
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
}: {
  id: string;
  taskUpdated: boolean;
  topContent: React.ReactNode;
  handleRowAction: (taskId: string) => void;
}) => {
  const [user, setUser] = useState<UserSchema>({} as UserSchema);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/rnd-unique-user?id=${id}`);
        const data = await response.json();

        setUser(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
    fetchData();
  }, [id]);

  const tasksList = useSortTasksList(`/api/rnd-task?id=${id}`);

  useEffect(() => {
    tasksList.reload();
  }, [id, taskUpdated]);

  return (
    <>
      <div className="flex flex-col">
        <h1 className={title()}>{user.name}</h1>
        <h2 className={title({ size: "xs" })}>Tasks</h2>
      </div>

      <div className="mt-10 w-full">
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
              <div className="flex justify-end w-full">{topContent}</div>
            }
            onRowAction={(key) => handleRowAction(key.toString())}
            onSortChange={tasksList.sort}
          >
            <TableHeader>
              <TableColumn key="created" allowsSorting className="text-center">
                created
              </TableColumn>
              <TableColumn key="task" allowsSorting className="text-center">
                task
              </TableColumn>
              <TableColumn key="status" allowsSorting className="text-center">
                status
              </TableColumn>
              <TableColumn key="priority" allowsSorting className="text-center">
                priority
              </TableColumn>
              <TableColumn
                key="impactedPeople"
                allowsSorting
                className="text-center"
              >
                impacted
              </TableColumn>
              <TableColumn key="comment" className="text-center">
                comment
              </TableColumn>
              <TableColumn key="dueDate" allowsSorting className="text-center">
                due date
              </TableColumn>
              <TableColumn
                key="startedAt"
                allowsSorting
                className="text-center"
              >
                started at
              </TableColumn>
              <TableColumn
                key="completedAt"
                allowsSorting
                className="text-center"
              >
                completed at
              </TableColumn>
            </TableHeader>
            <TableBody
              emptyContent="No entries found"
              isLoading={tasksList.isLoading}
              items={tasksList.items}
              loadingContent={<LoadingContent />}
            >
              {tasksList.items.map((task) => (
                <TableRow key={task.id}>
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
                  <TableCell className="text-center">{task.priority}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
