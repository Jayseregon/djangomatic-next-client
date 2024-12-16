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
import { ProjectType, RoadmapProjectCardType } from "@/interfaces/roadmap";

import RoadmapCard from "./RoadmapCard";
import SortableItem from "./SortableItem";

export default function ProjectView({
  projectId,
  session,
}: {
  projectId: string;
  session: any;
}) {
  const [project, setProject] = useState<ProjectType | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/roadmap-projects/find?id=${projectId}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (!session) return <UnAuthenticated />;
  if (!project) return <div>Loading...</div>;

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = project.projectCards.findIndex(
        (item: RoadmapProjectCardType) => item.id === active.id
      );
      const newIndex = project.projectCards.findIndex(
        (item: RoadmapProjectCardType) => item.id === over.id
      );
      
      const newProjectCards = arrayMove(project.projectCards, oldIndex, newIndex);
      
      // Update local state
      setProject({
        ...project,
        projectCards: newProjectCards
      });

      // Update positions in the database
      const updates = newProjectCards.map((card, index) => ({
        id: card.id,
        position: index,
      }));

      try {
        await fetch("/api/roadmap-project-cards/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates }),
        });
      } catch (error) {
        console.error('Error updating card positions:', error);
      }
    }
  };

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
            items={project.projectCards.map((projectCard) => projectCard.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.projectCards.map((projectCard) => (
                <SortableItem 
                  key={projectCard.id} 
                  id={projectCard.id}
                  data={projectCard}
                >
                  <RoadmapCard 
                    card={projectCard.card!} 
                    setCards={() => {}} 
                  />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </UserAccessBoards>
  );
}
