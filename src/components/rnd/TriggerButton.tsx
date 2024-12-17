import React from "react";
import { Button } from "@nextui-org/react";
import { ListPlus } from "lucide-react";

export const TriggerButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      isIconOnly
      color="success"
      size="sm"
      variant="bordered"
      onPress={onClick}
    >
      <ListPlus />
    </Button>
  );
};
