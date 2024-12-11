"use client";

import { Button, Input } from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { CircleX, FolderOpenDot, FolderPlus, House, Save } from "lucide-react";

import { ProjectType } from "@/src/interfaces/roadmap";
import SortableItem from "@/components/boards/roadmap/SortableItem";

export const SidebarRoadmap = (): JSX.Element => {
  const router = useRouter();
  const rootPath = "/boards/roadmap";
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [projectName, setProjectName] = useState("");
  const [showProjectInput, setShowProjectInput] = useState(false);

  useEffect(() => {
    fetch("/api/roadmap-projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
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
    <div className="flex flex-col gap-2">
      <div className="flex justify-evenly my-3">
        <Button
          isIconOnly
          color="primary"
          onClick={() => router.push(rootPath)}
        >
          <House />
        </Button>
        <Button
          isIconOnly
          color="success"
          variant="ghost"
          onClick={() => setShowProjectInput(true)}
        >
          <FolderPlus />
        </Button>
      </div>
      {showProjectInput && (
        <div className="flex items-center gap-1 mb-3">
          <Input
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <Button isIconOnly color="success" radius="full" onClick={addProject}>
            <Save />
          </Button>
          <Button
            isIconOnly
            color="danger"
            radius="full"
            onClick={() => setShowProjectInput(false)}
          >
            <CircleX />
          </Button>
        </div>
      )}
      <div>
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
                <div className="flex p-2 border rounded-md justify-between">
                  <h3>
                    {project.name} ({project.cards.length})
                  </h3>
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
  );
};
