"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import {
  DndContext,
  rectIntersection,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import UserAccessBoards from "@/src/components/boards/UserAccess";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { CardType } from "@/interfaces/roadmap";

import RoadmapCard from "./RoadmapCard";
import SortableItem from "./SortableItem";

export default function ProjectView({
  projectId,
  session,
}: {
  projectId: string;
  session: any;
}) {
  const [project, setProject] = useState<any>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/roadmap-projects/find?id=${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
      });
  }, [projectId]);

  if (!session) return <UnAuthenticated />;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = project.cards.findIndex(
        (item: CardType) => item.id === active.id,
      );
      const newIndex = project.cards.findIndex(
        (item: CardType) => item.id === over.id,
      );
      const newCards = arrayMove(project.cards, oldIndex, newIndex);

      // Update positions in the database
      (newCards as CardType[]).forEach((item: CardType, index: number) => {
        fetch("/api/roadmap-cards/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id, position: index }),
        });
      });

      setProject({ ...project, cards: newCards });
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <UserAccessBoards
      boardType="canAccessRoadmapBoard"
      email={session.user.email}
    >
      <div className="p-4">
        <Button onClick={() => router.back()}>Back</Button>
        <h1>{project.name}</h1>
        <DndContext
          collisionDetection={rectIntersection}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={project.projectCards.map((card: CardType) => card.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.projectCards.map((card: CardType) => (
                <SortableItem key={card.id} id={card.id}>
                  <RoadmapCard card={card} setCards={() => {}} />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </UserAccessBoards>
  );
}
