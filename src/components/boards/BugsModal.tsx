"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DatePicker,
  Select,
  SelectItem,
  Button,
  Input,
  Textarea,
  Chip,
} from "@nextui-org/react";
import {
  DateValue,
  parseDate,
  getLocalTimeZone,
} from "@internationalized/date";
import { CircleOff, Save, Trash2 } from "lucide-react";

import { BugReport, BugStatus, BugPriority } from "@/interfaces/bugs";
import { bugStatusColorMap, bugPriorityColorMap } from "@/lib/utils";

interface BugsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Partial<BugReport>) => void;
  initialBug?: Partial<BugReport>;
  mode: "add" | "edit";
  onBugChange: () => void;
  sessionUsername: string;
}

export const BugsModal = ({
  visible,
  onClose,
  onSave,
  initialBug,
  mode,
  onBugChange,
  sessionUsername,
}: BugsModalProps) => {
  const t = useTranslations("Boards.bugReport");
  const defaultBug: Partial<BugReport> = {
    title: "",
    description: "",
    createdBy: sessionUsername,
    assignedTo: "",
    priority: BugPriority.LOW,
    status: BugStatus.OPEN,
    assignedDate: null,
    completedDate: null,
    comments: "",
  };

  const initialState = useMemo(() => {
    if (initialBug) {
      return initialBug;
    } else {
      return defaultBug;
    }
  }, [initialBug, mode]);

  const [bug, setBug] = useState<Partial<BugReport>>(initialState);

  useEffect(() => {
    if (visible) {
      setBug(initialState);
    }
  }, [visible, initialState]);

  const handleInputChange = (field: string, value: string) => {
    setBug((prevBug) => ({
      ...prevBug,
      [field]: value,
    }));
  };

  const handleDateChange =
    (field: "assignedDate" | "completedDate") => (value: DateValue | null) => {
      setBug((prevBug) => ({
        ...prevBug,
        [field]: value ? value.toDate(getLocalTimeZone()) : null,
      }));
    };

  const handleStatusChange = (keys: any) => {
    const selectedKey = keys.currentKey as BugStatus;

    setBug((prevBug) => {
      const newBug = { ...prevBug, status: selectedKey };

      if (selectedKey === BugStatus.CLOSED) {
        newBug.completedDate = new Date();
        if (!newBug.assignedDate) {
          newBug.assignedDate = new Date();
        }
      } else if (selectedKey === BugStatus.IN_PROGRESS) {
        newBug.assignedDate = new Date();
        newBug.completedDate = null;
      } else if (selectedKey === BugStatus.OPEN) {
        newBug.assignedDate = null;
        newBug.completedDate = null;
      }

      return newBug;
    });
  };

  const statusOptions = useMemo(() => Object.values(BugStatus), []);
  const priorityOptions = useMemo(() => Object.values(BugPriority), []);

  const handleSaveClick = () => {
    if (mode === "add") {
      onSave({ ...bug, createdBy: sessionUsername });
    } else {
      onSave(bug); // Do not modify 'createdBy' when editing
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/bug-report/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: bug.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete bug");
      }
      onBugChange();
      onClose();
    } catch (error) {
      console.error("Error deleting bug:", error);
    }
  };

  return (
    <Modal
      hideCloseButton
      aria-labelledby="modal-title"
      backdrop="blur"
      classNames={{
        base: "bg-background border border-foreground",
      }}
      isOpen={visible}
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-row justify-between items-center w-full">
          {mode === "add" ? t("modal.addNew") : t("modal.editBug")}
          {mode !== "add" ? (
            <Button
              isIconOnly
              aria-label="Delete Bug"
              color="danger"
              variant="light"
              onClick={handleDelete}
            >
              <Trash2 />
            </Button>
          ) : null}
        </ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <div className="flex flex-row gap-2">
            <Input
              isClearable
              aria-label="Title"
              className="basis-3/4"
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              label={t("tableColumns.title")}
              labelPlacement="outside"
              placeholder="..."
              value={bug.title || ""}
              variant="bordered"
              onValueChange={(val) => handleInputChange("title", val)}
            />

            <Select
              aria-label="Status"
              className="basis-1/3"
              classNames={{
                trigger: "border-0",
                label: "text-center w-full",
                popoverContent: "bg-background",
              }}
              label={t("tableColumns.status")}
              labelPlacement="outside"
              placeholder="..."
              renderValue={(selected) => {
                const selectedStatusObj = Array.from(selected)[0];
                const selectedStatus = selectedStatusObj?.key || "";

                return (
                  <Chip
                    className="capitalize"
                    color={bugStatusColorMap[selectedStatus as BugStatus]}
                    size="sm"
                    variant="flat"
                  >
                    {typeof selectedStatus === "string"
                      ? selectedStatus.toLowerCase()
                      : ""}
                  </Chip>
                );
              }}
              selectedKeys={bug.status ? new Set([bug.status]) : new Set()}
              variant="bordered"
              onSelectionChange={handleStatusChange}
            >
              {statusOptions.map((status) => (
                <SelectItem
                  key={status}
                  classNames={{
                    base: "hover:!bg-foreground/30 focus:!bg-foreground/30",
                  }}
                  textValue={status}
                  value={status}
                >
                  <Chip
                    className="capitalize"
                    color={bugStatusColorMap[status]}
                    size="sm"
                    variant="flat"
                  >
                    {status.toLowerCase()}
                  </Chip>
                </SelectItem>
              ))}
            </Select>

            <Select
              aria-label="Priority"
              className="basis-1/3"
              classNames={{
                trigger: "border-0",
                label: "text-center w-full",
                popoverContent: "bg-background",
              }}
              label={t("tableColumns.priority")}
              labelPlacement="outside"
              placeholder="..."
              renderValue={(selected) => {
                const selectedPriorityObj = Array.from(selected)[0];
                const selectedPriority = selectedPriorityObj?.key || "";

                return (
                  <Chip
                    className="capitalize"
                    color={bugPriorityColorMap[selectedPriority as BugPriority]}
                    size="sm"
                    variant="flat"
                  >
                    {typeof selectedPriority === "string"
                      ? selectedPriority.toLowerCase()
                      : ""}
                  </Chip>
                );
              }}
              selectedKeys={bug.priority ? new Set([bug.priority]) : new Set()}
              variant="bordered"
              onSelectionChange={(keys) => {
                const selectedKey = keys.currentKey as BugPriority;

                handleInputChange("priority", selectedKey);
              }}
            >
              {priorityOptions.map((priority) => (
                <SelectItem
                  key={priority}
                  classNames={{
                    base: "hover:!bg-foreground/30 focus:!bg-foreground/30",
                  }}
                  textValue={priority}
                  value={priority}
                >
                  <Chip
                    className="capitalize"
                    color={bugPriorityColorMap[priority]}
                    size="sm"
                    variant="flat"
                  >
                    {priority.toLowerCase()}
                  </Chip>
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex flex-row gap-2">
            <Input
              isReadOnly
              aria-label="createdBy"
              className="basis-1/2"
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              label={t("tableColumns.createdBy")}
              labelPlacement="outside"
              placeholder="..."
              value={bug.createdBy || sessionUsername}
              variant="bordered"
            />
            <Input
              isReadOnly
              aria-label="assignedTo"
              className="basis-1/2"
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              label={t("tableColumns.assignedTo")}
              labelPlacement="outside"
              placeholder="None"
              value={bug.assignedTo || ""}
              variant="bordered"
            />
          </div>

          <Textarea
            aria-label="Description"
            classNames={{
              input: "border-0 focus:ring-0",
              inputWrapper: "border-foreground/50 hover:!border-foreground",
            }}
            label={t("tableColumns.description")}
            labelPlacement="outside"
            maxRows={10}
            minRows={5}
            placeholder="..."
            value={bug.description || ""}
            variant="bordered"
            onValueChange={(val) => handleInputChange("description", val)}
          />

          <Textarea
            aria-label="Comments"
            classNames={{
              input: "border-0 focus:ring-0",
              inputWrapper: "border-foreground/50 hover:!border-foreground",
            }}
            label={t("tableColumns.comments")}
            labelPlacement="outside"
            maxRows={10}
            minRows={5}
            placeholder="..."
            value={bug.comments || ""}
            variant="bordered"
            onValueChange={(val) => handleInputChange("comments", val)}
          />

          <div className="flex flex-row gap-2">
            <DatePicker
              aria-label="Assigned Date"
              classNames={{
                selectorIcon: "text-foreground",
              }}
              dateInputClassNames={{
                inputWrapper:
                  "border-foreground/50 rounded-full hover:border-foreground",
              }}
              label={t("tableColumns.assignedDate")}
              labelPlacement="outside"
              name="assignedDate"
              value={
                bug.assignedDate
                  ? parseDate(bug.assignedDate.toISOString().split("T")[0])
                  : null
              }
              variant="bordered"
              onChange={handleDateChange("assignedDate")}
            />

            <DatePicker
              aria-label="Completed Date"
              classNames={{
                selectorIcon: "text-foreground",
              }}
              dateInputClassNames={{
                inputWrapper:
                  "border-foreground/50 rounded-full hover:border-foreground",
              }}
              label={t("tableColumns.completedDate")}
              labelPlacement="outside"
              name="completedDate"
              value={
                bug.completedDate
                  ? parseDate(bug.completedDate.toISOString().split("T")[0])
                  : null
              }
              variant="bordered"
              onChange={handleDateChange("completedDate")}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-row gap-3">
            <Button
              isIconOnly
              aria-label="Save Bug"
              color="success"
              isDisabled={!bug.title && !bug.description}
              onClick={handleSaveClick}
            >
              <Save />
            </Button>
            <Button
              isIconOnly
              aria-label="Close Modal"
              color="danger"
              variant="bordered"
              onClick={onClose}
            >
              <CircleOff />
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
