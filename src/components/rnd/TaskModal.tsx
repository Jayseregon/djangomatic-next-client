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

import { DatePicker } from "@/components/ui/DatePicker";
import { UserSchema, RnDTeamTask, Status } from "@/interfaces/lib";
import { statusColorMap } from "@/lib/utils";

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Partial<RnDTeamTask>) => void;
  initialTask?: Partial<RnDTeamTask>;
  mode: "add" | "edit";
  currentUser?: UserSchema;
  onTaskChange: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onClose,
  onSave,
  initialTask,
  mode,
  currentUser,
  onTaskChange,
}) => {
  const [users, setUsers] = useState<UserSchema[]>([]);
  const t = useTranslations("RnD");
  const defaultTask: Partial<RnDTeamTask> = {
    task: "",
    priority: 0,
    impactedPeople: "",
    comment: "",
    status: Status.CREATED,
    dueDate: null,
    startedAt: null,
    completedAt: null,
  };

  const initialState = useMemo(() => {
    if (initialTask) {
      return initialTask;
    } else if (mode === "add" && currentUser) {
      return { ...defaultTask, owner: currentUser };
    } else {
      return defaultTask;
    }
  }, [initialTask, currentUser, mode]);

  const [task, setTask] = useState<Partial<RnDTeamTask>>(initialState);

  useEffect(() => {
    if (visible) {
      setTask(initialState);
      fetchUsers();
    }
  }, [visible, initialState]);

  async function fetchUsers() {
    try {
      const response = await fetch("/api/rnd-all-users");
      const data: UserSchema[] = await response.json();

      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  useEffect(() => {
    setTask(initialState);
  }, [initialState]);

  const handleInputChange = (field: string, value: string) => {
    setTask((prevTask) => ({
      ...prevTask,
      [field]: value,
    }));
  };

  const handleSelectChange = (keys: any) => {
    const selectedKey = keys.currentKey as string;
    const selectedUser = users.find((user) => user.id === selectedKey);

    setTask((prevTask) => ({ ...prevTask, owner: selectedUser }));
  };

  const handleDateChange =
    (field: "dueDate" | "startedAt" | "completedAt") =>
    (value: Date | null) => {
      setTask((prevTask) => ({
        ...prevTask,
        [field]: value,
      }));
    };

  const handlePriorityChange = (keys: any) => {
    const selectedKey = keys.currentKey as string;

    setTask((prevTask) => ({
      ...prevTask,
      priority: parseInt(selectedKey, 10),
    }));
  };

  const handleImpactedPeopleChange = (keys: any) => {
    const selectedKey = keys.currentKey as string;

    setTask((prevTask) => ({
      ...prevTask,
      impactedPeople: selectedKey,
    }));
  };

  const handleStatusChange = (keys: any) => {
    const selectedKey = keys.currentKey as Status;

    setTask((prevTask) => {
      const newTask = { ...prevTask, status: selectedKey };

      if (selectedKey === Status.COMPLETED) {
        if (!prevTask.completedAt) {
          newTask.completedAt = new Date();
        }
        if (!prevTask.startedAt) {
          newTask.startedAt = newTask.completedAt;
        }
      } else if (
        selectedKey === Status.CREATED ||
        selectedKey === Status.NEXT_UP
      ) {
        newTask.startedAt = null;
        newTask.completedAt = null;
      } else if (
        (selectedKey === Status.IN_PROGRESS ||
          selectedKey === Status.PENDING ||
          selectedKey === Status.BLOCKED) &&
        (prevTask.status === Status.CREATED ||
          prevTask.status === Status.NEXT_UP) &&
        !prevTask.startedAt
      ) {
        newTask.startedAt = new Date();
      }

      return newTask;
    });
  };

  const priorityOptions = [...Array.from({ length: 11 }, (_, i) => i), 99];
  const impactedPeopleOptions = ["1-5", "5-10", "10-15", "15-25", "25+"];
  const statusOptions = useMemo(() => Object.values(Status), []);

  const options = useMemo(() => {
    if (task.owner) {
      const isOwnerInUsers = users.some((user) => user.id === task.owner!.id);

      if (!isOwnerInUsers) {
        return [task.owner, ...users];
      }
    }

    return users;
  }, [users, task.owner]);

  const handleSaveClick = () => {
    onSave(task);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/rnd-task/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: task.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      onTaskChange();
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
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
          {mode === "add" ? t("taskModal.addNew") : t("taskModal.editTask")}
          {mode !== "add" ? (
            <Button
              isIconOnly
              aria-label="Delete Task"
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
              className="basis-3/4"
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              label={t("taskBoardColumns.task")}
              labelPlacement="outside"
              placeholder="..."
              value={task.task || ""}
              variant="bordered"
              onValueChange={(val) => handleInputChange("task", val)}
            />
            <Select
              aria-label="Status"
              className="basis-1/4"
              classNames={{
                trigger: "border-0",
                label: "text-center w-full",
                popoverContent: "bg-background",
              }}
              label={t("taskBoardColumns.status")}
              labelPlacement="outside"
              placeholder="..."
              renderValue={(selected) => {
                // Convert the selected Set to an array and extract the first item's key
                const selectedStatusObj = Array.from(selected)[0];
                const selectedStatus = selectedStatusObj?.key || "";

                return (
                  <Chip
                    className="capitalize"
                    color={statusColorMap[selectedStatus as Status]}
                    size="sm"
                    variant="flat"
                  >
                    {typeof selectedStatus === "string"
                      ? selectedStatus.toLowerCase()
                      : ""}
                  </Chip>
                );
              }}
              selectedKeys={task.status ? new Set([task.status]) : new Set()}
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
                    color={statusColorMap[status]}
                    size="sm"
                    variant="flat"
                  >
                    {status.toLowerCase()}
                  </Chip>
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex flex-row gap-2">
            <Select
              aria-label="Owner"
              classNames={{
                trigger:
                  "border-foreground/50 rounded-full hover:!border-foreground",
              }}
              label={t("taskBoardColumns.owner")}
              labelPlacement="outside"
              placeholder="..."
              selectedKeys={task.owner ? new Set([task.owner.id]) : new Set()}
              variant="bordered"
              onSelectionChange={handleSelectChange}
            >
              {options.map((user) => (
                <SelectItem
                  key={user.id}
                  classNames={{
                    base: "hover:!bg-foreground/30 focus:!bg-foreground/30",
                  }}
                  textValue={user.name}
                  value={user.id}
                >
                  {user.name}
                </SelectItem>
              ))}
            </Select>

            <Select
              aria-label="Priority"
              classNames={{
                trigger:
                  "border-foreground/50 rounded-full hover:!border-foreground",
              }}
              label={t("taskBoardColumns.priority")}
              labelPlacement="outside"
              placeholder="..."
              selectedKeys={
                task.priority != null
                  ? new Set([task.priority.toString()])
                  : new Set()
              }
              variant="bordered"
              onSelectionChange={handlePriorityChange}
            >
              {priorityOptions.map((i) => (
                <SelectItem
                  key={i}
                  classNames={{
                    base: "hover:!bg-foreground/30 focus:!bg-foreground/30",
                  }}
                  textValue={i.toString()}
                  value={i.toString()}
                >
                  {i}
                </SelectItem>
              ))}
            </Select>

            <Select
              aria-label="Impacted People"
              classNames={{
                trigger:
                  "border-foreground/50 rounded-full hover:!border-foreground",
              }}
              label={t("taskBoardColumns.impacted")}
              labelPlacement="outside"
              placeholder="..."
              selectedKeys={
                task.impactedPeople ? new Set([task.impactedPeople]) : new Set()
              }
              variant="bordered"
              onSelectionChange={handleImpactedPeopleChange}
            >
              {impactedPeopleOptions.map((i) => (
                <SelectItem
                  key={i}
                  classNames={{
                    base: "hover:!bg-foreground/30 focus:!bg-foreground/30",
                  }}
                  textValue={i}
                  value={i}
                >
                  {i}
                </SelectItem>
              ))}
            </Select>
          </div>

          <Textarea
            classNames={{
              input: "border-0 focus:ring-0",
              inputWrapper: "border-foreground/50 hover:!border-foreground",
            }}
            label={t("taskBoardColumns.comments")}
            labelPlacement="outside"
            maxRows={10}
            minRows={5}
            placeholder="..."
            value={task.comment || ""}
            variant="bordered"
            onValueChange={(val) => handleInputChange("comment", val)}
          />

          <div className="flex flex-row gap-2">
            <DatePicker
              className="flex-1"
              label={t("taskBoardColumns.dueDate")}
              placeholder={t("taskBoardColumns.dueDate")}
              value={task.dueDate}
              onChange={handleDateChange("dueDate")}
            />
            <DatePicker
              className="flex-1"
              label={t("taskBoardColumns.startedAt")}
              placeholder={t("taskBoardColumns.startedAt")}
              value={task.startedAt}
              onChange={handleDateChange("startedAt")}
            />
            <DatePicker
              className="flex-1"
              label={t("taskBoardColumns.completedAt")}
              placeholder={t("taskBoardColumns.completedAt")}
              value={task.completedAt}
              onChange={handleDateChange("completedAt")}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-row gap-3">
            <Button
              isIconOnly
              aria-label="Save Task"
              color="success"
              isDisabled={!task.task || !task.owner}
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
