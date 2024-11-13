"use client";

import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@nextui-org/react";
import {
  DndContext,
  rectIntersection,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Grid2x2Plus } from "lucide-react";

import { CardType } from "@/interfaces/roadmap";
import { initialCards } from "@/data/initialCards";

import RoadmapCard from "./RoadmapCard";
import SortableItem from "./SortableItem";

function RoadmapBoard() {
  const [cards, setCards] = useState<CardType[]>(initialCards);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addCard = useCallback(() => {
    setCards((items) => [
      { id: uuidv4(), title: "", description: "", color: "" },
      ...items,
    ]);
  }, []);

  return (
    <div>
      <Button isIconOnly color="success" onClick={addCard}>
        <Grid2x2Plus />
      </Button>
      <DndContext
        collisionDetection={rectIntersection}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={cards} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {cards.map((card) => (
              <SortableItem key={card.id} id={card.id}>
                <RoadmapCard card={card} setCards={setCards} />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default RoadmapBoard;
