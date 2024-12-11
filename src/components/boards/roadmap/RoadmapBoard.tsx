"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@nextui-org/react";
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
  SortableContext,
  rectSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Grid2x2Plus, FolderPlus } from "lucide-react";

import { CardType, ProjectType } from "@/interfaces/roadmap";

import RoadmapCard from "./RoadmapCard";
import SortableItem from "./SortableItem";

export default function RoadmapBoard() {
  const router = useRouter();
  const [cards, setCards] = useState<CardType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [projectName, setProjectName] = useState("");
  const [showProjectInput, setShowProjectInput] = useState(false);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    fetch("/api/roadmap-cards")
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
      });

    fetch("/api/roadmap-projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      });
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeType === "card") {
      if (overType === "card") {
        const activeProjectId = active.data.current?.projectId;
        const overProjectId = over.data.current?.projectId;

        if (!activeProjectId && !overProjectId) {
          if (activeId !== overId) {
            const oldIndex = cards.findIndex((card) => card.id === activeId);
            const newIndex = cards.findIndex((card) => card.id === overId);

            const newCards = arrayMove(cards, oldIndex, newIndex);

            setCards(newCards);

            // Update positions in the database
            const updates = newCards.map((card, index) => ({
              id: card.id,
              position: index,
            }));

            fetch("/api/roadmap-cards/update-positions", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ updates }),
            });
          }

          return;
        }
      }

      if (overType === "project") {
        const projectId = overId;
        const card = active.data.current?.card;

        // Check if card already exists in the target project
        const targetProject = projects.find((p) => p.id === projectId);

        if (
          targetProject &&
          targetProject.cards.some((c) => c.id === card.id)
        ) {
          // Card already exists in this project, ignore the drop
          return;
        }

        // Optimistic update
        setCards((prevCards) => prevCards.filter((c) => c.id !== activeId));
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  // Ensure no duplicates in the cards array
                  cards: [
                    ...project.cards.filter((c) => c.id !== card.id),
                    card,
                  ],
                }
              : project,
          ),
        );

        // API call
        fetch("/api/roadmap-cards/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: activeId, projectId }),
        }).catch((error) => {
          console.error("Failed to assign card to project:", error);
          // Revert optimistic update on error
          setCards((prevCards) => [...prevCards, card]);
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    cards: project.cards.filter((c) => c.id !== card.id),
                  }
                : project,
            ),
          );
        });
      }
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

  const addProject = useCallback(() => {
    if (!projectName.trim()) return;

    fetch("/api/roadmap-projects/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: projectName }),
    })
      .then((res) => res.json())
      .then((createdProject) => {
        setProjects((items) => [...items, { ...createdProject, cards: [] }]);
        setProjectName("");
        setShowProjectInput(false);
      });
  }, [projectName]);

  const viewProject = useCallback((projectId: string) => {
    router.push(`/boards/roadmap/projects/${projectId}`);
  }, []);

  return (
    <div>
      <div className="flex gap-2">
        <Button isIconOnly color="success" onClick={addCard}>
          <Grid2x2Plus />
        </Button>
        <Button
          isIconOnly
          color="primary"
          onClick={() => setShowProjectInput(true)}
        >
          <FolderPlus />
        </Button>
        {showProjectInput && (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <Button onClick={addProject}>Add Project</Button>
          </div>
        )}
      </div>
      <DndContext
        collisionDetection={rectIntersection}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <div className="mt-4">
          <h2>Unassigned Cards</h2>
          <SortableContext
            items={cards.map((card) => card.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cards.map((card) => (
                <SortableItem
                  key={card.id}
                  data={{ type: "card", card, projectId: null }}
                  id={card.id}
                >
                  <RoadmapCard card={card} setCards={setCards} />
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </div>

        <div className="mt-8">
          <h2>Projects</h2>
          <SortableContext
            items={projects.map((project) => project.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-4">
              {projects.map((project) => (
                <SortableItem
                  key={project.id}
                  data={{ type: "project" }}
                  id={project.id}
                >
                  <div className="p-4 border rounded-md">
                    <h3>{project.name}</h3>
                    <SortableContext
                      items={project.cards.map((card) => card.id)}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {project.cards
                          .filter(
                            (card, index, self) =>
                              // Remove any duplicate cards based on ID
                              index === self.findIndex((c) => c.id === card.id),
                          )
                          .map((card) => (
                            <SortableItem
                              key={`${project.id}-${card.id}`} // Use composite key to ensure uniqueness
                              data={{
                                type: "card",
                                card,
                                projectId: project.id,
                              }}
                              id={card.id}
                            >
                              <RoadmapCard
                                card={card}
                                setCards={(updatedCards) =>
                                  setProjects((prevProjects) =>
                                    prevProjects.map((p) =>
                                      p.id === project.id
                                        ? {
                                            ...p,
                                            cards: Array.isArray(updatedCards)
                                              ? updatedCards.filter(
                                                  (c, i, arr) =>
                                                    // Remove duplicates when updating cards
                                                    arr.findIndex(
                                                      (card) =>
                                                        card.id === c.id,
                                                    ) === i,
                                                )
                                              : [],
                                          }
                                        : p,
                                    ),
                                  )
                                }
                              />
                            </SortableItem>
                          ))}
                      </div>
                    </SortableContext>
                    <Button
                      as="a"
                      className="mt-2"
                      onClick={() => viewProject(project.id)}
                    >
                      View Project
                    </Button>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
