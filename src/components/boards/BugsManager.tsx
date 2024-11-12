"use client";

import React, { useState } from "react";

import { convertBugsDates } from "@/lib/utils";
import SimpleAccordion from "@/components/rnd/SimpleAccordion";
import { BugReport, BugsManagerProps } from "@/interfaces/bugs";

import { BugsModal } from "./BugsModal";
import { BugsBoard } from "./BugsBoard";
import { AddBugButton } from "./AddBugButton";

export const BugsManager = ({
  sessionUsername,
  isAdminSide = false,
}: BugsManagerProps) => {
  const [bugUpdated, setBugUpdated] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [bugToEdit, setBugToEdit] = useState<Partial<BugReport> | null>(null);
  const handleBugChange = () => {
    setBugUpdated((prev) => !prev);
  };

  const handleRowAction = async (bugId: string) => {
    try {
      const response = await fetch(`/api/bug-report/find?id=${bugId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch bug");
      }
      const bug = await response.json();
      const bugWithDates: BugReport = convertBugsDates(bug);

      setBugToEdit(bugWithDates);
      setEditModalVisible(true);
    } catch (error) {
      console.error("Error fetching bug:", error);
    }
  };

  const handleEditSave = async (updatedBug: Partial<BugReport>) => {
    if (!bugToEdit || !bugToEdit.id) return;

    try {
      const response = await fetch("/api/bug-report/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: bugToEdit.id, ...updatedBug }),
      });

      if (!response.ok) {
        throw new Error("Failed to update bug");
      }
      setEditModalVisible(false);
      setBugToEdit(null);
      handleBugChange();
    } catch (error) {
      console.error("Error updating bug:", error);
    }
  };

  const handleModalClose = () => {
    setEditModalVisible(false);
    setBugToEdit(null);
  };

  return (
    <>
      <div className="space-y-10">
        <BugsBoard
          bugsUpdated={bugUpdated}
          handleRowAction={handleRowAction}
          topContent={
            <AddBugButton
              isAdminSide={isAdminSide}
              sessionUsername={sessionUsername}
              onBugChange={handleBugChange}
            />
          }
        />
        <SimpleAccordion menuKey="archives" title="archives">
          <BugsBoard
            showCompleted
            bugsUpdated={bugUpdated}
            handleRowAction={handleRowAction}
            topContent={null}
          />
        </SimpleAccordion>
      </div>
      {bugToEdit && (
        <BugsModal
          initialBug={bugToEdit}
          isAdminSide={isAdminSide}
          mode="edit"
          sessionUsername={sessionUsername}
          visible={editModalVisible}
          onBugChange={handleBugChange}
          onClose={handleModalClose}
          onSave={handleEditSave}
        />
      )}
    </>
  );
};
