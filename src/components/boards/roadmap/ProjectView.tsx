"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Button,
  Input,
  Textarea,
  DatePicker,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
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
import { useDebouncedCallback } from "use-debounce";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { DoorOpen, Trash } from "lucide-react";

import UserAccessBoards from "@/src/components/boards/UserAccess";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import {
  ProjectType,
  CardType,
  RoadmapCardCategory,
} from "@/interfaces/roadmap";
import { convertProjectDates } from "@/lib/utils";
import {
  deletegRoadmapProject,
  getRoadmapCardCategories,
} from "@/src/actions/prisma/roadmap/action";

import RoadmapCard from "./RoadmapCard";
import SortableItem from "./SortableItem";

export default function ProjectView({
  projectId,
  session,
}: {
  projectId: string;
  session: any;
}) {
  const t = useTranslations("Boards.roadmap");
  const [project, setProject] = useState<ProjectType | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const router = useRouter();
  const [categories, setCategories] = React.useState<RoadmapCardCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getRoadmapCardCategories();

      setCategories(res ?? []);
    };

    fetchCategories();
  }, []);

  // Move all hooks before any conditional returns
  const debouncedUpdate = useDebouncedCallback((field, value) => {
    fetch("/api/roadmap-projects/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: project!.id, [field]: value }),
    });
  }, 500);

  const handleFieldChange = useCallback(
    (field: string, value: any) => {
      if (!project) return;
      const updatedProject = { ...project, [field]: value };

      setProject(updatedProject);
      debouncedUpdate(field, value);
    },
    [project, debouncedUpdate],
  );

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `/api/roadmap-projects/find?id=${projectId}`,
        );

        if (!response.ok) throw new Error("Failed to fetch project");
        const data = await response.json();

        setProject(convertProjectDates(data));
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // Conditional returns after hooks
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

  const handleDeleteProject = async () => {
    if (!project) return;

    try {
      await deletegRoadmapProject(project.id);
      router.back();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  return (
    <UserAccessBoards
      boardType="canAccessRoadmapBoard"
      email={session.user.email}
    >
      <div className="mx-10">
        <Card className="bg-background border border-foreground/50 mb-10 p-2">
          <CardHeader className="grid grid-cols-[1fr_auto] gap-5">
            {/* Project Name */}
            <Input
              aria-label="Project Name"
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              label={t("projectCardPlaceholders.pName")}
              labelPlacement="outside"
              value={project.name}
              variant="bordered"
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
            <div className="grid grid-cols-2 h-full gap-5">
              <div className="h-full content-end">
                <Button
                  isIconOnly
                  className="text-white w-full"
                  color="primary"
                  onPress={() => router.back()}
                >
                  <DoorOpen />
                </Button>
              </div>
              <div className="h-full content-end">
                <Button
                  isIconOnly
                  className="text-white w-full"
                  color="danger"
                  onPress={handleDeleteProject}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col text-start gap-10">
            {/* Members Input */}
            <Input
              aria-label="Members"
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              label={t("projectCardPlaceholders.pMembers")}
              labelPlacement="outside"
              value={project.members || ""}
              variant="bordered"
              onChange={(e) => handleFieldChange("members", e.target.value)}
            />

            {/* Date Inputs */}
            <div className="flex flex-row gap-5">
              <DatePicker
                aria-label="Due Date"
                classNames={{
                  selectorIcon: "text-foreground",
                }}
                dateInputClassNames={{
                  inputWrapper:
                    "border-foreground/50 rounded-full hover:border-foreground",
                }}
                label={t("projectCardPlaceholders.pDueDate")}
                labelPlacement="outside"
                name="dueDate"
                value={
                  project.dueDate
                    ? parseDate(project.dueDate.toISOString().split("T")[0])
                    : null
                }
                variant="bordered"
                onChange={(value) =>
                  handleFieldChange(
                    "dueDate",
                    value ? value.toDate(getLocalTimeZone()) : null,
                  )
                }
              />
              <DatePicker
                aria-label="Started At"
                classNames={{
                  selectorIcon: "text-foreground",
                }}
                dateInputClassNames={{
                  inputWrapper:
                    "border-foreground/50 rounded-full hover:border-foreground",
                }}
                label={t("projectCardPlaceholders.pStartedDate")}
                labelPlacement="outside"
                name="startedAt"
                value={
                  project.startedAt
                    ? parseDate(project.startedAt.toISOString().split("T")[0])
                    : null
                }
                variant="bordered"
                onChange={(value) =>
                  handleFieldChange(
                    "startedAt",
                    value ? value.toDate(getLocalTimeZone()) : null,
                  )
                }
              />
              <DatePicker
                aria-label="Completed At"
                classNames={{
                  selectorIcon: "text-foreground",
                }}
                dateInputClassNames={{
                  inputWrapper:
                    "border-foreground/50 rounded-full hover:border-foreground",
                }}
                label={t("projectCardPlaceholders.pCompletedDate")}
                labelPlacement="outside"
                name="completedAt"
                value={
                  project.completedAt
                    ? parseDate(project.completedAt.toISOString().split("T")[0])
                    : null
                }
                variant="bordered"
                onChange={(value) =>
                  handleFieldChange(
                    "completedAt",
                    value ? value.toDate(getLocalTimeZone()) : null,
                  )
                }
              />
            </div>

            {/* Comment Textarea */}
            <Textarea
              classNames={{
                input: "border-0 focus:ring-0",
                inputWrapper: "border-foreground/50 hover:!border-foreground",
              }}
              label={t("projectCardPlaceholders.pComments")}
              labelPlacement="outside"
              minRows={5}
              value={project.comment || ""}
              variant="bordered"
              onChange={(e) => handleFieldChange("comment", e.target.value)}
            />
          </CardBody>
        </Card>

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
                    categories={categories}
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
