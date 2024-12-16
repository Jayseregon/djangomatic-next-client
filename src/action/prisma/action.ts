"use server";

import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { capitalizeFirstLetters } from "@/src/lib/utils";

const prisma = new PrismaClient();

export async function createRoadmapCardCategory(categoryName: string) {
  try {
    const capitalizedCategoryName = capitalizeFirstLetters(categoryName);

    await prisma.roadmapCardCategory.create({
      data: {
        name: z.string().parse(capitalizedCategoryName),
      },
    });
  } catch (error: any) {
    console.log("Error creating category:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getRoadmapCardCategories() {
  try {
    const categories = await prisma.roadmapCardCategory.findMany();

    return categories;
  } catch (error: any) {
    console.log("Error getting categories:", error);
  } finally {
    await prisma.$disconnect();
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
  } finally {
    await prisma.$disconnect();
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
  } finally {
    await prisma.$disconnect();
  }
}
