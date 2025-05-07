import React, { useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@heroui/react";
import { Save, CircleOff, MapPin, Timer, TimerReset } from "lucide-react";

import { GainTrackingStatus } from "@/generated/client";
import { EditGainsRecordModalProps } from "@/src/interfaces/rnd";
import { getRndUsers } from "@/src/actions/prisma/rndTask/action";
import { UserSchema } from "@/src/interfaces/lib";

export const EditGainsRecordModal = ({
  isOpen,
  onClose,
  onSave,
  record,
}: EditGainsRecordModalProps) => {
  // Form state
  const [region, setRegion] = useState<string>(record?.region || "");
  const [hasGains, setHasGains] = useState<boolean>(record?.hasGains || false);
  const [replaceOffshore, setReplaceOffshore] = useState<boolean>(
    record?.replaceOffshore || false,
  );
  const [timeInitial, setTimeInitial] = useState<string>(
    record?.timeInitial?.toString() || "",
  );
  const [timeSaved, setTimeSaved] = useState<string>(
    record?.timeSaved?.toString() || "",
  );
  const [comments, setComments] = useState<string>(record?.comments || "");
  const [status, setStatus] = useState<GainTrackingStatus>(
    record?.status || GainTrackingStatus.OPEN,
  );
  const [users, setUsers] = useState<UserSchema[]>([]);
  const [taskOwner, setTaskOwner] = useState<string>(record?.taskOwner || "");

  // Fetch users when modal opens
  React.useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getRndUsers();

        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  // Reset form when record changes
  React.useEffect(() => {
    if (record) {
      setRegion(record.region || "");
      setHasGains(record.hasGains);
      setReplaceOffshore(record.replaceOffshore);
      setTimeInitial(record.timeInitial.toString());
      setTimeSaved(record.timeSaved.toString());
      setComments(record.comments || "");
      setStatus(record.status);
      setTaskOwner(record.taskOwner || "");
    }
  }, [record]);

  const timeInitialError = useMemo(() => {
    if (!timeInitial) return "Initial time is required";
    const numValue = Number(timeInitial);

    if (isNaN(numValue)) return "Initial time must be a number";
    if (numValue < 0) return "Initial time cannot be negative";

    return null;
  }, [timeInitial]);

  const timeSavedError = useMemo(() => {
    if (!timeSaved) return "Saved time is required";
    const numValue = Number(timeSaved);

    if (isNaN(numValue)) return "Saved time must be a number";
    if (numValue < 0) return "Saved time cannot be negative";

    return null;
  }, [timeSaved]);

  // Determine if form is valid
  const isFormValid = !timeInitialError && !timeSavedError;

  // Handle user selection change
  const handleSelectChange = (keys: any) => {
    const selectedKey = keys.currentKey as string;
    const selectedUser = users.find((user) => user.id === selectedKey);

    setTaskOwner(selectedUser?.name || "");
  };

  // Handle save
  const handleSave = () => {
    if (!isFormValid || !record) return;

    onSave({
      id: record.id,
      region,
      hasGains,
      replaceOffshore,
      timeInitial: Number(timeInitial),
      timeSaved: Number(timeSaved),
      comments,
      status,
      taskOwner,
    });
  };

  return (
    <Modal
      hideCloseButton
      aria-labelledby="edit-record-modal"
      backdrop="blur"
      classNames={{
        base: "bg-background border border-foreground",
      }}
      isOpen={isOpen}
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>Edit &quot;{record?.name}&quot;</ModalHeader>
        <ModalBody className="gap-4">
          <div className="flex flex-row gap-6 mt-2">
            <Input
              isClearable
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              label="Region"
              labelPlacement="outside"
              placeholder="Enter region..."
              startContent={<MapPin />}
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              onClear={() => setRegion("")}
            />

            <Select
              aria-label="status"
              classNames={{
                trigger: "border-0",
                label: "w-full",
                popoverContent: "bg-background",
              }}
              label="Status"
              labelPlacement="outside"
              selectedKeys={[status]}
              onChange={(e) =>
                setStatus(e.target.value.toUpperCase() as GainTrackingStatus)
              }
            >
              {Object.keys(GainTrackingStatus)
                .filter((key) => isNaN(Number(key))) // Filter out numeric keys
                .map((statusKey) => (
                  <SelectItem
                    key={
                      GainTrackingStatus[
                        statusKey as keyof typeof GainTrackingStatus
                      ]
                    }
                  >
                    {statusKey.charAt(0) + statusKey.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
            </Select>
          </div>

          <div className="flex flex-row gap-6 mt-2">
            <Select
              aria-label="task-owner"
              className="basis-1/2"
              classNames={{
                trigger: "border-0",
                label: "w-full",
                popoverContent: "bg-background",
              }}
              label="Task Owner"
              labelPlacement="outside"
              placeholder="Owner..."
              selectedKeys={
                users.find((user) => user.name === taskOwner)
                  ? new Set([
                      users.find((user) => user.name === taskOwner)?.id || "",
                    ])
                  : new Set()
              }
              onChange={handleSelectChange}
            >
              {users.map((user) => (
                <SelectItem key={user.id} textValue={user.name}>
                  {user.name}
                </SelectItem>
              ))}
            </Select>

            <div className="flex flex-row gap-6 basis-1/2">
              <Switch
                aria-label="has-gains"
                isSelected={hasGains}
                onValueChange={setHasGains}
              >
                Has Gains
              </Switch>

              <Switch
                aria-label="replace-offshore"
                isSelected={replaceOffshore}
                onValueChange={setReplaceOffshore}
              >
                Replace Offshore
              </Switch>
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <Input
              isClearable
              className="basis-1/2"
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              errorMessage={timeInitialError}
              isInvalid={!!timeInitialError}
              label="Initial Time (hrs)"
              labelPlacement="outside"
              placeholder="Enter initial time..."
              startContent={<Timer />}
              type="number"
              value={timeInitial}
              onChange={(e) => setTimeInitial(e.target.value)}
              onClear={() => setTimeInitial("")}
            />

            <Input
              isClearable
              className="basis-1/2"
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              errorMessage={timeSavedError}
              isInvalid={!!timeSavedError}
              label="Saved Time (hrs)"
              labelPlacement="outside"
              placeholder="Enter saved time..."
              startContent={<TimerReset />}
              type="number"
              value={timeSaved}
              onChange={(e) => setTimeSaved(e.target.value)}
              onClear={() => setTimeSaved("")}
            />
          </div>

          <Textarea
            classNames={{
              input: "border-0 focus:ring-0",
              inputWrapper: "border-foreground/50 hover:!border-foreground",
            }}
            label="Comments"
            labelPlacement="outside"
            maxRows={10}
            minRows={3}
            placeholder="Enter comments..."
            value={comments}
            variant="bordered"
            onValueChange={(val) => setComments(val)}
          />
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-row gap-3">
            <Button
              isIconOnly
              aria-label="Save Edit"
              color="success"
              isDisabled={!isFormValid}
              onPress={handleSave}
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
