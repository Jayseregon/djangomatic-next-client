"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  pointerWithin,
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
  FolderOpenDot,
  ListFilterPlus,
} from "lucide-react";

import {
  createRoadmapCardCategory,
  getRoadmapCardCategories,
  getRoadmapCards,
  getRoadmapProjects,
} from "@/src/action/prisma/action";
import {
  CardType,
  ProjectType,
  RoadmapCardCategory,
} from "@/interfaces/roadmap";
import { NonceContext } from "@/src/app/providers";

import RoadmapCard from "./RoadmapCard";
import SortableItem from "./SortableItem";
import AddInput from "./AddInput";

export default function RoadmapBoard() {
  const router = useRouter();
  const nonce = useContext(NonceContext);
  const [cards, setCards] = useState<CardType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [categories, setCategories] = React.useState<RoadmapCardCategory[]>([]);
  const [projectName, setProjectName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [showProjectInput, setShowProjectInput] = useState(false);
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    const fetchCards = async () => {
      const res = await getRoadmapCards();

      setCards(res as unknown as CardType[]);
    };

    fetchCards();

    const fetchProjects = async () => {
      const res = await getRoadmapProjects();
      const sorted = res?.sort((a, b) => a.position - b.position);

      setProjects(sorted as unknown as ProjectType[]);
    };

    fetchProjects();

    const fetchCategories = async () => {
      const res = await getRoadmapCardCategories();

      setCategories(res || []);
    };

    fetchCategories();
  }, []);

  // Group cards by category
  const cardsByCategory = categories
    .map((category) => ({
      category,
      cards: cards
        .filter((card) => card.category?.id === category.id)
        .sort((a, b) => a.position - b.position),
    }))
    .filter(({ cards }) => cards.length > 0);

  // Add grouping for uncategorized cards
  const uncategorizedCards = cards
    .filter((card) => !card.category)
    .sort((a, b) => a.position - b.position);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type === "card" && overData?.type === "card") {
      const activeCategoryId = activeData.categoryId;
      const overCategoryId = overData.categoryId;

      if (activeCategoryId === overCategoryId) {
        const categoryId = activeCategoryId;
        const categoryCards = cards
          .filter((card) => card.category?.id === categoryId)
          .sort((a, b) => a.position - b.position);

        const oldIndex = categoryCards.findIndex(
          (card) => card.id === activeId
        );
        const newIndex = categoryCards.findIndex((card) => card.id === overId);

        if (oldIndex !== newIndex) {
          const newCategoryCards = arrayMove(categoryCards, oldIndex, newIndex);

          // Update positions in state
          setCards((prevCards) =>
            prevCards.map((card) => {
              if (card.category?.id === categoryId) {
                const index = newCategoryCards.findIndex(
                  (c) => c.id === card.id
                );

                return { ...card, position: index };
              }

              return card;
            })
          );

          // Update positions in the database
          const updates = newCategoryCards.map((card) => ({
            id: card.id,
            position: card.position,
          }));

          fetch("/api/roadmap-cards/update-positions", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ updates }),
          });
        }
      }
    }

    if (activeData?.type === "project" && overData?.type === "project") {
      if (activeId !== overId) {
        const oldIndex = projects.findIndex(
          (project) => project.id === activeId
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

    if (activeData?.type === "card") {
      if (overData?.type === "card") {
        const activeProjectId = activeData.projectId;
        const overProjectId = overData.projectId;

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

      if (overData?.type === "project") {
        const projectId = overId;
        const card = activeData.card;

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
              : project
          )
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
                : project
            )
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

  const addCategory = useCallback(() => {
    if (!categoryName.trim()) return;
    const createCategory = async () => {
      await createRoadmapCardCategory(categoryName);
      setCategoryName("");
      setShowCategoryInput(false);
    };

    createCategory();
  }, [categoryName]);

  const viewProject = useCallback((projectId: string) => {
    router.push(`/boards/roadmap/projects/${projectId}`);
  }, []);

  return (
    <div>
      {/* top content with buttons & commands */}
      <div
        className="flex flex-row gap-10 my-3"
        nonce={nonce}
        style={{ marginLeft: "31rem" }}>
        <div className="flex gap-3">
          <Button
            isIconOnly
            color="success"
            onClick={addCard}>
            <Grid2x2Plus />
          </Button>
          <Button
            isIconOnly
            color="primary"
            onClick={() => setShowProjectInput(true)}>
            <FolderPlus />
          </Button>
          <Button
            isIconOnly
            color="primary"
            onClick={() => setShowCategoryInput(true)}>
            <ListFilterPlus />
          </Button>
        </div>
        {showProjectInput && (
          <div className="flex items-center gap-2">
            <AddInput
              inputValue={projectName}
              placeholder="Project Name"
              setInputValue={setProjectName}
              setShowInput={setShowProjectInput}
              onClick={addProject}
            />
          </div>
        )}
        {showCategoryInput && (
          <div className="flex items-center gap-2">
            <AddInput
              inputValue={categoryName}
              placeholder="Category Name"
              setInputValue={setCategoryName}
              setShowInput={setShowCategoryInput}
              onClick={addCategory}
            />
          </div>
        )}
      </div>

      <div
        nonce={nonce}
        style={{
          position: "fixed",
          top: "15rem",
          left: "1.5rem",
          width: "30rem",
          zIndex: 30,
        }}>
        <h2 className="text-foreground text-2xl font-semibold">Projects</h2>
      </div>

      <DndContext
        collisionDetection={pointerWithin}
        modifiers={[]} // Remove any existing modifiers that might cause flickering
        sensors={sensors}
        onDragEnd={handleDragEnd}>
        {/* Fixed position side projects container */}
        <div
          nonce={nonce}
          style={{
            position: "fixed",
            top: "17.5rem",
            left: "1.5rem",
            width: "30rem",
            maxHeight: "calc(95vh - 18rem)", // Adjust for top offset
            overflowY: "auto",
            zIndex: 30,
          }}>
          {/* side content with projects as drop targets */}
          <div className="flex flex-col gap-4">
            <SortableContext
              items={projects.map((project) => project.id)}
              strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-5">
                {projects.map((project) => (
                  <SortableItem
                    key={project.id}
                    data={{ type: "project" }}
                    id={project.id}>
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
                        onClick={() => viewProject(project.id)}>
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
            top: "17.5rem",
            right: "1.5rem",
            width: "calc(100% - 33rem)", // Adjust for left offset
            maxHeight: "calc(95vh - 18rem)", // Adjust for top offset
            overflowY: "auto",
            zIndex: 30,
            marginLeft: "32rem",
          }}>
          {/* main content to display all cards */}

          {/* Render categorized cards */}
          <div className="flex-grow px-4">
            <div className="w-full">
              {/* Render uncategorized cards */}
              {uncategorizedCards.length > 0 && (
                <div key="uncategorized">
                  <SortableContext
                    items={uncategorizedCards.map((card) => card.id)}
                    strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uncategorizedCards.map((card) => (
                        <SortableItem
                          key={card.id}
                          data={{ type: "card", categoryId: null }}
                          id={card.id}>
                          <RoadmapCard
                            card={card}
                            setCards={setCards}
                          />
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </div>
              )}
              {cardsByCategory.map(({ category, cards }) => (
                <div key={category.id}>
                  <h3 className="text-foreground text-2xl pt-8 pb-4 font-semibold">
                    {category.name}
                  </h3>
                  <SortableContext
                    items={cards.map((card) => card.id)}
                    strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {cards.map((card) => (
                        <SortableItem
                          key={card.id}
                          data={{ type: "card", categoryId: category.id }}
                          id={card.id}>
                          <RoadmapCard
                            card={card}
                            setCards={setCards}
                          />
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
