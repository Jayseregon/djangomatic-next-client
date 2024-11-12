"use client";
import React, { useState } from "react";

import { AddBugButtonProps, BugReport } from "@/interfaces/bugs";
import { TriggerButton } from "@/components/rnd/TriggerButton";

import { BugsModal } from "./BugsModal";

export const AddBugButton = ({
  onBugChange,
  sessionUsername,
  isAdminSide,
}: AddBugButtonProps) => {
  const [visible, setVisible] = useState(false);

  const handleSave = async (bug: Partial<BugReport>) => {
    try {
      const response = await fetch("/api/bug-report/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bug),
      });

      if (!response.ok) {
        throw new Error("Failed to save bug");
      }
      setVisible(false);
      onBugChange();
    } catch (error) {
      console.error("Error saving bug:", error);
    }
  };

  return (
    <>
      <TriggerButton onClick={() => setVisible(true)} />
      <BugsModal
        isAdminSide={isAdminSide}
        mode="add"
        sessionUsername={sessionUsername}
        visible={visible}
        onBugChange={onBugChange}
        onClose={() => setVisible(false)}
        onSave={handleSave}
      />
    </>
  );
};
