import React from "react";
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

import { CellEditData } from "@/src/interfaces/rnd";

interface EditCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingCell: CellEditData | null;
  count: string;
  setCount: (value: string) => void;
  rate: string;
  setRate: (value: string) => void;
  adjustedCost: string;
  setAdjustedCost: (value: string) => void;
  subtotal: number;
  grandTotal: number;
}

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
