"use server";

import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { capitalizeFirstLetters } from "@/src/lib/utils";

const prisma = new PrismaClient();

// export default async function PostPage(props: {
//   params: Promise<{ slug: string }>;
// }) {
//   const { slug } = await props.params;
//   const postDb = await prisma.blogPost.findUnique({
//     where: {
//       slug: slug,
//     },
//   });

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
