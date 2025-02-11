"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/src/lib/prismaClient";
import { capitalizeFirstLetters } from "@/src/lib/utils";

export async function createRoadmapCardCategory(categoryName: string) {
  try {
    const capitalizedCategoryName = capitalizeFirstLetters(categoryName);

    await prisma.roadmapCardCategory.create({
      data: {
        name: z.string().parse(capitalizedCategoryName),
      },
    });
    revalidatePath("/");
  } catch (error: any) {
    console.log("Error creating category:", error);
  }
}

export async function getRoadmapCardCategories() {
  try {
    const categories = await prisma.roadmapCardCategory.findMany();

    return categories;
  } catch (error: any) {
    console.log("Error getting categories:", error);
  }
}

export async function getRoadmapCards() {
  try {
    const cards = await prisma.roadmapCard.findMany({
      include: {
        projectCards: {
          include: {
            project: true, // Include project details if needed
          },
        },
        category: true,
      },
      orderBy: { position: "asc" },
    });

    return cards;
  } catch (error: any) {
    console.log("Error getting cards:", error);
  }
}

export async function getRoadmapProjects() {
  try {
    const projects = await prisma.roadmapProject.findMany({
      include: {
        projectCards: {
          include: {
            card: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: { position: "asc" },
    });

    return projects;
  } catch (error: any) {
    console.log("Error getting projects:", error);
  }
}

export async function createRoadmapProject(name: string, position?: number) {
  try {
    const newProject = await prisma.roadmapProject.create({
      data: {
        name,
        position: position || 0,
      },
    });

    revalidatePath("/");

    return newProject;
  } catch (error: any) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function deletegRoadmapProject(id: string) {
  try {
    // Delete related RoadmapProjectCard entries
    await prisma.roadmapProjectCard.deleteMany({
      where: { projectId: id },
    });

    // Delete the RoadmapProject
    await prisma.roadmapProject.delete({
      where: { id },
    });
    revalidatePath("/");
  } catch (error: any) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

export async function updateCardPositions(
  updates: Array<{ projectId: string; cardId: string; position: number }>,
) {
  try {
    const projectId = updates[0]?.projectId;

    if (!projectId) throw new Error("No project ID provided");

    // Begin transaction
    const result = await prisma.$transaction(async (tx) => {
      // First update all positions
      await Promise.all(
        updates.map(({ projectId, cardId, position }) =>
          tx.roadmapProjectCard.update({
            where: { projectId_cardId: { projectId, cardId } },
            data: { position },
          }),
        ),
      );

      // Then fetch the updated project with cards in correct order
      const updatedProject = await tx.roadmapProject.findUnique({
        where: { id: projectId },
        include: {
          projectCards: {
            orderBy: { position: "asc" },
            include: {
              card: {
                include: { category: true },
              },
            },
          },
        },
      });

      if (!updatedProject) throw new Error("Project not found");

      return updatedProject;
    });

    revalidatePath("/boards/roadmap");
    revalidatePath(`/boards/roadmap/projects/${projectId}`);

    return result;
  } catch (error) {
    console.error("Error updating card positions:", error);
    throw error;
  }
}
