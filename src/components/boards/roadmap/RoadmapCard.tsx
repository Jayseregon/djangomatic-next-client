import React, { useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
} from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { CardType } from "@/interfaces/roadmap";
import { cn } from "@/src/lib/utils";

// Define the custom Badge component
const Badge: React.FC<{ color: string }> = ({ color }) => (
  <div className="flex flex-row gap-1">
    <span
      aria-label={`${color} badge`}
      className={`inline-block rounded-full bg-${color}-400 w-4 h-4`}
    />
    <span className="text-background">{color}</span>
  </div>
);

function RoadmapCard({
  card,
  setCards,
}: {
  card: CardType;
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
}) {
  const debouncedUpdate = useDebouncedCallback((field, value) => {
    fetch("/api/roadmap-cards/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: card.id, [field]: value }),
    });
  }, 500);

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      const updatedCard = { ...card, title: newTitle };

      setCards((items) =>
        items.map((item) => (item.id === card.id ? updatedCard : item)),
      );
      debouncedUpdate("title", newTitle);
    },
    [card, setCards, debouncedUpdate],
  );

  const handleDescriptionChange = useCallback(
    (newDescription: string) => {
      const updatedCard = { ...card, description: newDescription };

      setCards((items) =>
        items.map((item) => (item.id === card.id ? updatedCard : item)),
      );
      debouncedUpdate("description", newDescription);
    },
    [card, setCards, debouncedUpdate],
  );

  const handleColorChange = useCallback(
    (newColor: string) => {
      const updatedCard = { ...card, color: newColor };

      setCards((items) =>
        items.map((item) => (item.id === card.id ? updatedCard : item)),
      );
      fetch("/api/roadmap-cards/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: card.id, color: newColor }),
      });
    },
    [card, setCards],
  );

  const handleDelete = useCallback(() => {
    fetch("/api/roadmap-cards/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: card.id }),
    }).then(() => {
      setCards((items) => items.filter((item) => item.id !== card.id));
    });
  }, [card.id, setCards]);

  const colorOptions = [
    "gray",
    "red",
    "orange",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
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
      <CardHeader className="flex flex-row items-center">
        <Input
          isClearable
          aria-label="Title"
          // className="basis-3/4"
          classNames={{
            input: "border-0 focus:ring-0 m-0 p-0",
            inputWrapper: card.color
              ? "border-background/50 hover:!border-background"
              : "border-foreground/50 hover:!border-foreground",
          }}
          placeholder="Title"
          value={card.title}
          variant="bordered"
          onValueChange={handleTitleChange}
        />
      </CardHeader>
      <CardBody>
        <Textarea
          aria-label="Description"
          classNames={{
            input: "border-0 focus:ring-0 p-0 m-0",
            inputWrapper: card.color
              ? "border-background/50 hover:!border-background"
              : "border-foreground/50 hover:!border-foreground",
          }}
          minRows={2}
          placeholder="Description"
          value={card.description}
          variant="bordered"
          onValueChange={handleDescriptionChange}
        />
      </CardBody>
      <CardFooter className="flex items-center justify-between">
        <Select
          aria-label="Background Color"
          className="basis-1/2 p-0 m-0"
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
        <Button
          isIconOnly
          color="danger"
          variant="light"
          onPress={handleDelete}
        >
          <Trash2 />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default React.memo(RoadmapCard);
