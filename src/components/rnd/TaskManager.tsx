"use client";

import React, { useState, useEffect } from "react";

import { RnDTeamTask, UserSchema } from "@/interfaces/lib";
import { convertTaskDates } from "@/lib/utils";

import { TaskBoardFull, TaskBoardShort } from "./TaskBoard";
import { AddTaskButton } from "./AddTaskButton";
import { TaskModal } from "./TaskModal";
import SimpleAccordion from "./SimpleAccordion";

export const TaskManager = ({
  id,
  user,
}: {
  id?: string;
  user?: UserSchema;
}) => {
  const [taskUpdated, setTaskUpdated] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Partial<RnDTeamTask> | null>(
    null,
  );
  const [currentUser, setCurrentUser] = useState<UserSchema | undefined>(user);

  useEffect(() => {
    if (id && !user) {
      async function fetchUser() {
        try {
          const response = await fetch(`/api/rnd-unique-user?id=${id}`);

          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }
          const userData = await response.json();

          setCurrentUser(userData);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      fetchUser();
    } else {
      setCurrentUser(user);
    }
  }, [id, user]);

  const handleTaskChange = () => {
    setTaskUpdated((prev) => !prev);
  };

  const handleRowAction = async (taskId: string) => {
    try {
      const response = await fetch(`/api/rnd-task/find?id=${taskId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }
      const task = await response.json();
      const taskWithDates: RnDTeamTask = convertTaskDates(task);

      setTaskToEdit(taskWithDates);
      setEditModalVisible(true);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const handleEditSave = async (updatedTask: Partial<RnDTeamTask>) => {
    if (!taskToEdit || !taskToEdit.id) return;

    try {
      const response = await fetch("/api/rnd-task/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: taskToEdit.id, ...updatedTask }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      setEditModalVisible(false);
      setTaskToEdit(null);
      handleTaskChange();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleModalClose = () => {
    setEditModalVisible(false);
    setTaskToEdit(null);
  };

  return (
    <>
      {id ? (
        <>
          <TaskBoardFull
            handleRowAction={handleRowAction}
            id={id}
            taskUpdated={taskUpdated}
            topContent={
              <AddTaskButton
                user={currentUser}
                onTaskChange={handleTaskChange}
              />
            }
          />
          <SimpleAccordion menuKey="archives" title="archives">
            <TaskBoardFull
              showCompleted
              handleRowAction={handleRowAction}
              id={id}
              taskUpdated={taskUpdated}
              topContent={null}
            />
          </SimpleAccordion>
        </>
      ) : (
        <TaskBoardShort
          handleRowAction={handleRowAction}
          taskUpdated={taskUpdated}
          topContent={
            <AddTaskButton user={currentUser} onTaskChange={handleTaskChange} />
          }
          user={currentUser as UserSchema}
        />
      )}
      {taskToEdit && (
        <TaskModal
          initialTask={taskToEdit}
          mode="edit"
          visible={editModalVisible}
          onClose={handleModalClose}
          onSave={handleEditSave}
          onTaskChange={handleTaskChange}
        />
      )}
    </>
  );
};
