import { Button, Input } from "@heroui/react";
import { Save, CircleX } from "lucide-react";

import { AddInputProps } from "@/src/interfaces/roadmap";

export default function AddInput({
  placeholder,
  inputValue,
  setInputValue,
  setShowInput,
  onClick,
}: AddInputProps) {
  return (
    <>
      <Input
        classNames={{
          input: "border-0 focus:ring-0",
          inputWrapper: "border-foreground/50 hover:!border-foreground",
        }}
        placeholder={placeholder}
        value={inputValue}
        variant="bordered"
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button isIconOnly color="success" onPress={onClick}>
        <Save />
      </Button>
      <Button isIconOnly color="danger" onPress={() => setShowInput(false)}>
        <CircleX />
      </Button>
    </>
  );
}
