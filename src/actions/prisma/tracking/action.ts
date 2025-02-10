"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/src/lib/prismaClient";

export async function createAppTrackingEntry(
  task_id: string,
  app_name: string,
  endpoint: string,
) {
  try {
    const record = await prisma.appUsageTracking.create({
      data: {
        task_id: z.string().parse(task_id),
        app_name: z.string().parse(app_name),
        endpoint: z.string().parse(endpoint),
      },
    });

    if (!record) {
      throw new Error("Error creating new tracking entry");
    }
    revalidatePath("/");

    return record.id;
  } catch (error) {
    throw new Error(
      `Error creating new tracking entry: ${(error as Error).message}`,
    );
  }
}

export async function updateAppTrackingEntry(
  task_id: string,
  entryId: string,
  status: string,
  elapsed_time: string,
) {
  try {
    const record = await prisma.appUsageTracking.update({
      where: {
        id: entryId,
        task_id: task_id,
      },
      data: {
        status: z.string().parse(status),
        elapsed_time: z.string().parse(elapsed_time),
      },
    });

    if (!record) {
      throw new Error("Error updating tracking entry");
    }
    console.log("Updated tracking entry:", record);

    revalidatePath("/");
  } catch (error) {
    throw new Error(
      `Error updating tracking entry: ${(error as Error).message}`,
    );
  }
}
