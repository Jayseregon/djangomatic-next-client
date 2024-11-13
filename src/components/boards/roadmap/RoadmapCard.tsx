import React, { useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@nextui-org/react";

import { CardType } from "@/interfaces/roadmap";
import { cn } from "@/src/lib/utils";

// Define the custom Badge component
const Badge: React.FC<{ color: string }> = ({ color }) => (
  <span
    aria-label={`${color} badge`}
    className={`inline-block rounded-full bg-${color}-400 w-4 h-4`}
  />
);

function RoadmapCard({
  card,
  setCards,
}: {
  card: CardType;
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
}) {
  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setCards((items: any[]) =>
        items.map((item) =>
          item.id === card.id ? { ...item, title: newTitle } : item,
        ),
      );
    },
    [card.id, setCards],
  );

  const handleDescriptionChange = useCallback(
    (newDescription: string) => {
      setCards((items: any[]) =>
        items.map((item) =>
          item.id === card.id ? { ...item, description: newDescription } : item,
        ),
      );
    },
    [card.id, setCards],
  );

  const handleColorChange = useCallback(
    (newColor: string) => {
      setCards((items: any[]) =>
        items.map((item) =>
          item.id === card.id ? { ...item, color: newColor } : item,
        ),
      );
    },
    [card.id, setCards],
  );

  const colorOptions = [
    "slate",
    "gray",
    "zinc",
    "neutral",
    "stone",
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
  ];

  return (
    <Card
      className={cn(
        `bg-${card.color}-400`,
        card.color
          ? `border border-${card.color}-400`
          : "border border-foreground",
        "w-full",
        "h-full",
        card.color ? `text-${card.color}-950` : "text-foreground",
      )}
    >
      <CardHeader className="flex flex-row items-center gap-2">
        <Input
          isClearable
          aria-label="Title"
          className="basis-3/4"
          classNames={{
            input: "border-0 focus:ring-0",
            inputWrapper: card.color
              ? "border-background/50 hover:!border-background"
              : "border-foreground/50 hover:!border-foreground",
          }}
          placeholder="Title"
          value={card.title}
          variant="bordered"
          onValueChange={handleTitleChange}
        />
        <Select
          aria-label="Background Color"
          className="basis-1/4"
          classNames={{
            trigger: card.color
              ? "border-0 text-background border border-background/50"
              : "border-0 text-foreground border border-foreground/50",
            label: "text-center",
            popoverContent: "bg-background",
          }}
          renderValue={() => <Badge color={card.color} />}
          selectedKeys={card.color ? new Set([card.color]) : new Set()}
          variant="bordered"
          onSelectionChange={(keys) => {
            const selectedKey = keys.currentKey as string;

            handleColorChange(selectedKey);
          }}
        >
          {colorOptions.map((color) => (
            <SelectItem
              key={color}
              classNames={{
                base: "hover:!bg-foreground/30 focus:!bg-foreground/30",
              }}
              textValue={color}
              value={color}
            >
              <Badge color={color} />
            </SelectItem>
          ))}
        </Select>
      </CardHeader>
      <CardBody>
        <Textarea
          aria-label="Description"
          classNames={{
            input: "border-0 focus:ring-0",
            inputWrapper: card.color
              ? "border-background/50 hover:!border-background"
              : "border-foreground/50 hover:!border-foreground",
          }}
          maxRows={9}
          minRows={3}
          placeholder="Description"
          value={card.description}
          variant="bordered"
          onValueChange={handleDescriptionChange}
        />
      </CardBody>
    </Card>
  );
}

export default React.memo(RoadmapCard);
