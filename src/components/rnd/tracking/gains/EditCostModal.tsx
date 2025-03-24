import React, { useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { Save, CircleOff, DollarSign, Hash } from "lucide-react";

import { EditCostModalProps } from "@/src/interfaces/rnd";

export const EditCostModal = ({
  isOpen,
  onClose,
  onSave,
  editingCell,
  count,
  setCount,
  rate,
  setRate,
  adjustedCost,
  setAdjustedCost,
  subtotal,
  grandTotal,
}: EditCostModalProps) => {
  const countError = useMemo(() => {
    if (!count) return null;
    const numCount = Number(count);

    if (isNaN(numCount)) return "Count must be a number";
    if (numCount < 0) return "Count cannot be negative";

    return null;
  }, [count]);

  const rateError = useMemo(() => {
    if (!rate) return null;
    const numRate = Number(rate);

    if (isNaN(numRate)) return "Rate must be a number";
    if (numRate < 0) return "Rate cannot be negative";

    return null;
  }, [rate]);

  const adjustedCostError = useMemo(() => {
    if (!adjustedCost) return null;
    const numAdjustedCost = Number(adjustedCost);

    if (isNaN(numAdjustedCost)) return "Adjusted cost must be a number";

    return null;
  }, [adjustedCost]);

  // Determine if the form is valid for submission
  const isFormValid = !countError && !rateError && !adjustedCostError;

  return (
    <Modal
      hideCloseButton
      aria-labelledby="edit-cost-modal"
      backdrop="blur"
      classNames={{
        base: "bg-background border border-foreground",
      }}
      isOpen={isOpen}
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader>Edit {editingCell?.month} Cost</ModalHeader>
        <ModalBody>
          <div className="flex flex-row gap-2">
            <Input
              isClearable
              className="basis-1/2"
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              errorMessage={countError}
              isInvalid={!!countError}
              label="Count"
              labelPlacement="outside"
              placeholder="Enter count..."
              startContent={<Hash />}
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              onClear={() => setCount("")}
            />
            <Input
              isClearable
              className="basis-1/2"
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              errorMessage={rateError}
              isInvalid={!!rateError}
              label="Rate"
              labelPlacement="outside"
              placeholder="Enter rate..."
              startContent={<DollarSign />}
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              onClear={() => setRate("")}
            />
            <Input
              readOnly
              className="basis-1/2"
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              label="Subtotal"
              labelPlacement="outside"
              startContent={<DollarSign />}
              type="text"
              value={subtotal > 0 ? `$${subtotal.toLocaleString()}` : ""}
            />
          </div>
          <Input
            isClearable
            classNames={{
              input: "border-0 focus:ring-0",
              inputWrapper: "border-foreground/50 hover:!border-foreground",
            }}
            errorMessage={adjustedCostError}
            isInvalid={!!adjustedCostError}
            label="Adjusted Cost"
            labelPlacement="outside"
            placeholder="Enter adjustment..."
            startContent={<DollarSign />}
            type="number"
            value={adjustedCost}
            onChange={(e) => setAdjustedCost(e.target.value)}
            onClear={() => setAdjustedCost("")}
          />
          <Input
            readOnly
            classNames={{
              input: "border-0 focus:ring-0",
              inputWrapper: "border-foreground/50 hover:!border-foreground",
            }}
            label="Grand Total"
            labelPlacement="outside"
            startContent={<DollarSign />}
            type="text"
            value={grandTotal > 0 ? `$${grandTotal.toLocaleString()}` : ""}
          />
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-row gap-3">
            <Button
              isIconOnly
              aria-label="Save Edit"
              color="success"
              isDisabled={!isFormValid}
              onPress={onSave}
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
