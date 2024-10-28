"use client";
import React, { useState } from "react";

import { RnDTeamTask, UserSchema } from "@/interfaces/lib";

import { TaskModal } from "./TaskModal";
import { TriggerButton } from "./TriggerButton";

export const AddTaskButton = ({
  onTaskChange,
  user,
}: {
  onTaskChange: () => void;
  user?: UserSchema;
}) => {
  const [visible, setVisible] = useState(false);

  const handleSave = async (task: Partial<RnDTeamTask>) => {
    try {
      const response = await fetch("/api/rnd-task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error("Failed to save task");
      }
      setVisible(false);
      onTaskChange();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <>
      <TriggerButton onClick={() => setVisible(true)} />
      <TaskModal
        currentUser={user}
        mode="add"
        visible={visible}
        onClose={() => setVisible(false)}
        onSave={handleSave}
        onTaskChange={onTaskChange}
      />
    </>
  );
};
