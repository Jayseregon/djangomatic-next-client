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
import { ProjectType, CardType } from "@/interfaces/roadmap";

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
        const response = await fetch(
          `/api/roadmap-projects/find?id=${projectId}`,
        );

        if (!response.ok) throw new Error("Failed to fetch project");
        const data = await response.json();

        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
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

    if (over && active.id !== over.id && project) {
      const oldIndex = project.projectCards.findIndex(
        (pc) => pc.id === active.id,
      );
      const newIndex = project.projectCards.findIndex(
        (pc) => pc.id === over.id,
      );

      if (oldIndex !== newIndex) {
        const newProjectCards = arrayMove(
          project.projectCards,
          oldIndex,
          newIndex,
        );

        // Optimistic update
        setProject({
          ...project,
          projectCards: newProjectCards.map((pc, index) => ({
            ...pc,
            position: index,
          })),
        });

        const updates = newProjectCards.map((pc, index) => ({
          projectId: project.id,
          cardId: pc.card!.id,
          position: index,
        }));

        try {
          const response = await fetch(
            "/api/roadmap-projects/update-card-positions",
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ updates }),
            },
          );
          const result = await response.json();

          if (!response.ok) {
            throw new Error("Failed to update positions");
          }

          // Update with server response
          if (result && Array.isArray(result)) {
            setProject((prev) => ({
              ...prev!,
              projectCards: result.map((pc) => ({
                id: pc.id,
                projectId: pc.projectId,
                cardId: pc.cardId,
                position: pc.position,
                card: pc.card,
              })),
            }));
          }
        } catch (error) {
          console.error("Failed to update card positions:", error);
          // Revert optimistic update
          setProject(project);
        }
      }
    }
  };

  const handleCardUpdate = (updatedCard: CardType) => {
    if (!project) return;

    setProject({
      ...project,
      projectCards: project.projectCards.map((pc) =>
        pc.card?.id === updatedCard.id ? { ...pc, card: updatedCard } : pc,
      ),
    });
  };

  return (
    <UserAccessBoards
      boardType="canAccessRoadmapBoard"
      email={session.user.email}
    >
      <div className="mx-10">
        <Button onClick={() => router.back()}>Back</Button>
        <h1>{project!.name}</h1>
        <DndContext
          collisionDetection={rectIntersection}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={project!.projectCards.map((pc) => pc.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {project!.projectCards.map((projectCard) => (
                <SortableItem
                  key={projectCard.id}
                  data={{
                    type: "projectCard",
                    projectId: project!.id,
                    cardId: projectCard.card!.id,
                  }}
                  id={projectCard.id}
                >
                  <RoadmapCard
                    card={projectCard.card!}
                    setCards={(cards) => {
                      if (typeof cards === "function") {
                        const updatedCard = cards([projectCard.card!])[0];

                        handleCardUpdate(updatedCard);
                      } else {
                        handleCardUpdate(cards[0]);
                      }
                    }}
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
