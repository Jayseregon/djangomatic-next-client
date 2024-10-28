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

import { RnDTeamTask, UserSchema } from "@/interfaces/lib";
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
  const [tasks, setTasks] = useState<RnDTeamTask[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`/api/rnd-task?id=${user.id}`);
        const data = await response.json();
        const tasksWithDates = data.map((task: RnDTeamTask) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          startedAt: task.startedAt ? new Date(task.startedAt) : undefined,
          completedAt: task.completedAt
            ? new Date(task.completedAt)
            : undefined,
        }));

        setTasks(tasksWithDates);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }

    fetchTasks();
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
          topContent={
            <div className="flex justify-between items-center w-full text-xl font-semibold">
              <p>{user.name}</p>
              {topContent}
            </div>
          }
          onRowAction={(key) => handleRowAction(key.toString())}
        >
          <TableHeader>
            <TableColumn key="task" className="text-center">
              task
            </TableColumn>
            <TableColumn key="status" className="text-center">
              status
            </TableColumn>
            <TableColumn key="priority" className="text-center">
              priority
            </TableColumn>
            <TableColumn key="dueDate" className="text-center">
              due date
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent="No entries found" items={tasks}>
            {tasks.map((task) => (
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
  const [tasks, setTasks] = useState<RnDTeamTask[]>([]);
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

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`/api/rnd-task?id=${id}`);
        const data = await response.json();
        const tasksWithDates = data.map((task: RnDTeamTask) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          startedAt: task.startedAt ? new Date(task.startedAt) : undefined,
          completedAt: task.completedAt
            ? new Date(task.completedAt)
            : undefined,
        }));

        setTasks(tasksWithDates);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }

    fetchTasks();
  }, [id, taskUpdated]);

  return (
    <>
      <h1 className={title()}>{user.name} Tasks</h1>

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
            topContent={
              <div className="flex justify-end w-full">{topContent}</div>
            }
            onRowAction={(key) => handleRowAction(key.toString())}
          >
            <TableHeader>
              <TableColumn key="created" className="text-center">
                created
              </TableColumn>
              <TableColumn key="task" className="text-center">
                task
              </TableColumn>
              <TableColumn key="status" className="text-center">
                status
              </TableColumn>
              <TableColumn key="priority" className="text-center">
                priority
              </TableColumn>
              <TableColumn key="impactedPeople" className="text-center">
                impacted
              </TableColumn>
              <TableColumn key="comment" className="text-center">
                comment
              </TableColumn>
              <TableColumn key="dueDate" className="text-center">
                due date
              </TableColumn>
              <TableColumn key="startedAt" className="text-center">
                started at
              </TableColumn>
              <TableColumn key="completedAt" className="text-center">
                completed at
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent="No entries found" items={tasks}>
              {tasks.map((task) => (
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
