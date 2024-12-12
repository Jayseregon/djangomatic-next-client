"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
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
import {
  Grid2x2Plus,
  FolderPlus,
  Save,
  CircleX,
  FolderOpenDot,
} from "lucide-react";

import { CardType, ProjectType } from "@/interfaces/roadmap";
import { NonceContext } from "@/src/app/providers";

import RoadmapCard from "./RoadmapCard";
import SortableItem from "./SortableItem";

export default function RoadmapBoard() {
  const router = useRouter();
  const nonce = useContext(NonceContext);
  const [cards, setCards] = useState<CardType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [projectName, setProjectName] = useState("");
  const [showProjectInput, setShowProjectInput] = useState(false);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    fetch("/api/roadmap-cards")
      .then((res) => res.json())
      .then((data) => {
        setCards(
          data.sort((a: CardType, b: CardType) => a.position - b.position),
        );
      });

    fetch("/api/roadmap-projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(
          data.sort(
            (a: ProjectType, b: ProjectType) => a.position - b.position,
          ),
        );
      });
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeType === "project" && overType === "project") {
      if (activeId !== overId) {
        const oldIndex = projects.findIndex(
          (project) => project.id === activeId,
        );
        const newIndex = projects.findIndex((project) => project.id === overId);

        const newProjects = arrayMove(projects, oldIndex, newIndex);

        // Update all positions based on new order
        const updatedProjects = newProjects.map((project, index) => ({
          ...project,
          position: index,
        }));

        setProjects(updatedProjects);

        // Update positions in the database
        const updates = updatedProjects.map((project) => ({
          id: project.id,
          position: project.position,
        }));

        fetch("/api/roadmap-projects/update-positions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates }),
        });
      }

      return;
    }

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

        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  cards: [...project.cards, card],
                }
              : project,
          ),
        );

        // Do not remove the card from the main view
        // setCards remains unchanged

        // API call
        fetch("/api/roadmap-cards/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: activeId, projectId }),
        }).catch((error) => {
          console.error("Failed to assign card to project:", error);
          // Revert optimistic update on error
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
      {/* top content with buttons & commands */}
      <div
        className="flex flex-row gap-10 my-3"
        nonce={nonce}
        style={{ marginLeft: "31rem" }}
      >
        <div className="flex gap-3">
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
        </div>
        {showProjectInput && (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <Button isIconOnly color="success" onClick={addProject}>
              <Save />
            </Button>
            <Button
              isIconOnly
              color="danger"
              onClick={() => setShowProjectInput(false)}
            >
              <CircleX />
            </Button>
          </div>
        )}
      </div>

      <div
        nonce={nonce}
        style={{
          position: "fixed",
          top: "20rem",
          left: "1.5rem",
          width: "30rem",
          zIndex: 30,
        }}
      >
        <h2 className="text-foreground text-2xl font-semibold">Projects</h2>
      </div>

      <DndContext
        collisionDetection={rectIntersection} // Changed from pointerWithin to rectIntersection
        modifiers={[]} // Remove any existing modifiers that might cause flickering
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        {/* Fixed position side projects container */}
        <div
          nonce={nonce}
          style={{
            position: "fixed",
            top: "22.5rem",
            left: "1.5rem",
            width: "30rem",
            maxHeight: "calc(100vh - 22.5rem)", // Adjust for top offset
            overflowY: "auto",
            zIndex: 30,
          }}
        >
          {/* side content with projects as drop targets */}
          <div className="flex flex-col gap-4">
            <SortableContext
              items={projects.map((project) => project.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-5">
                {projects.map((project) => (
                  <SortableItem
                    key={project.id}
                    data={{ type: "project" }}
                    id={project.id}
                  >
                    <div className="flex px-2 py-8 border border-foreground rounded-md justify-between">
                      <div className="flex flex-col text-left ps-3">
                        <h3 className="capitalize">{project.name}</h3>
                        <div className="italic font-light text-sm">
                          {project.cards.length} cards
                        </div>
                      </div>
                      <Button
                        isIconOnly
                        color="primary"
                        variant="light"
                        onClick={() => viewProject(project.id)}
                      >
                        <FolderOpenDot />
                      </Button>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </div>
        </div>

        {/* Main content adjusted for fixed sidebar */}
        <div
          nonce={nonce}
          style={{
            position: "fixed",
            top: "22.5rem",
            right: "1.5rem",
            width: "calc(100% - 33rem)", // Adjust for left offset
            maxHeight: "calc(100vh - 22.5rem)", // Adjust for top offset
            overflowY: "auto",
            zIndex: 30,
            marginLeft: "32rem",
          }}
        >
          {/* main content to display all cards */}
          <div className="flex-grow px-4">
            <div className="w-full">
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
          </div>
        </div>
      </DndContext>
    </div>
  );
}
