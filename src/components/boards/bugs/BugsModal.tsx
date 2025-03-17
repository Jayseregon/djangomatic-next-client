"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Button,
  Input,
  Textarea,
  Chip,
} from "@heroui/react";
import { CircleOff, Save, Trash2 } from "lucide-react";

import {
  BugReport,
  BugStatus,
  BugPriority,
  BugsModalProps,
} from "@/interfaces/bugs";
import { bugStatusColorMap, bugPriorityColorMap } from "@/lib/utils";
import { UserSchema } from "@/interfaces/lib";
import { DatePicker } from "@/components/ui/DatePicker";
import { getRndUsers } from "@/src/actions/prisma/rndTask/action";

export const BugsModal = ({
  visible,
  onClose,
  onSave,
  initialBug,
  mode,
  onBugChange,
  sessionUsername,
  isAdminSide,
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
  const [devUsers, setDevUsers] = useState<UserSchema[]>([]);

  useEffect(() => {
    if (visible) {
      setBug(initialState);
      fetchDevUsers();
    }
  }, [visible, initialState]);

  async function fetchDevUsers() {
    try {
      const data = await getRndUsers();

      if (!Array.isArray(data)) {
        setDevUsers([]);

        return;
      }

      setDevUsers(data);
    } catch (error) {
      setDevUsers([]); // Set empty array on error
      console.error("Failed to fetch users:", error);
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setBug((prevBug) => ({
      ...prevBug,
      [field]: value,
    }));
  };

  const handleDateChange =
    (field: "assignedDate" | "completedDate") => (value: Date | null) => {
      setBug((prevBug) => ({
        ...prevBug,
        [field]: value,
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

  const handleAssignedToChange = (keys: any) => {
    const selectedKey = keys.currentKey as string;

    setBug((prevBug) => ({
      ...prevBug,
      assignedTo: selectedKey,
    }));
  };

  const statusOptions = useMemo(() => Object.values(BugStatus), []);
  const priorityOptions = useMemo(() => Object.values(BugPriority), []);

  const handleSaveClick = () => {
    if (mode === "add") {
      onSave({
        ...bug,
        createdBy: sessionUsername,
        assignedDate: bug.assignedDate ? new Date(bug.assignedDate) : null,
        completedDate: bug.completedDate ? new Date(bug.completedDate) : null,
      });
    } else {
      onSave({
        ...bug,
        assignedDate: bug.assignedDate ? new Date(bug.assignedDate) : null,
        completedDate: bug.completedDate ? new Date(bug.completedDate) : null,
      });
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

  const options = useMemo(() => {
    if (bug.assignedTo) {
      const isAssignedToInUsers = devUsers.some(
        (user) => user.name === bug.assignedTo,
      );

      if (!isAssignedToInUsers) {
        return [{ name: bug.assignedTo }, ...devUsers];
      }
    }

    return devUsers;
  }, [devUsers, bug.assignedTo]);

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
              onPress={handleDelete}
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

            {isAdminSide ? (
              <Select
                aria-label="Assigned To"
                className="basis-1/2"
                classNames={{
                  trigger: "border-foreground/50 hover:!border-foreground",
                }}
                label={t("tableColumns.assignedTo")}
                labelPlacement="outside"
                placeholder="None"
                selectedKeys={
                  bug.assignedTo ? new Set([bug.assignedTo]) : new Set()
                }
                variant="bordered"
                onSelectionChange={handleAssignedToChange}
              >
                {options.map((user) => (
                  <SelectItem
                    key={user.name}
                    classNames={{
                      base: "hover:!bg-foreground/30 focus:!bg-foreground/30",
                    }}
                    textValue={user.name}
                  >
                    {user.name}
                  </SelectItem>
                ))}
              </Select>
            ) : (
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
            )}
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
              className="flex-1"
              label={t("tableColumns.assignedDate")}
              value={bug.assignedDate}
              onChange={handleDateChange("assignedDate")}
            />

            <DatePicker
              className="flex-1"
              label={t("tableColumns.completedDate")}
              value={bug.completedDate}
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
              onPress={handleSaveClick}
            >
              <Save />
            </Button>
            <Button
              isIconOnly
              aria-label="Close Modal"
              color="danger"
              variant="bordered"
              onPress={onClose}
            >
              <CircleOff />
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
