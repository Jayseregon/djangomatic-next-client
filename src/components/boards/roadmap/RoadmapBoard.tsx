"use client";

import React, { useCallback, useEffect, useState } from "react";
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

import RoadmapCard from "./RoadmapCard";
import SortableItem from "./SortableItem";

export default function RoadmapBoard() {
  const [cards, setCards] = useState<CardType[]>([]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    fetch("/api/roadmap-cards")
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
      });
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update positions in the database
        newItems.forEach((item, index) => {
          fetch("/api/roadmap-cards/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: item.id, position: index }),
          });
        });

        return newItems;
      });
    }
  };

  const addCard = useCallback(() => {
    fetch("/api/roadmap-cards/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: "", description: "", color: "" }),
    })
      .then((res) => res.json())
      .then((createdCard) => {
        setCards((items) => [...items, createdCard]);
      });
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
