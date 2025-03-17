"use server";

import { prisma } from "@/src/lib/prismaClient";
import { UserSchema } from "@/src/interfaces/lib";

/**
 * Get all RND tasks for a specific owner
 */
export async function getRndTasksByOwnerId(ownerId: string) {
  try {
    if (!ownerId) {
      throw new Error("ownerId is required");
    }

    const tasks = await prisma.rnDTeamTask.findMany({
      where: { ownerId: ownerId },
      include: { owner: true },
    });

    if (!tasks) {
      throw new Error("Tasks not found");
    }

    return tasks;
  } catch (error) {
    throw new Error(`Error fetching RND tasks: ${(error as Error).message}`);
  }
}

/**
 * Get a specific RND task by ID
 */
export async function getRndTaskById(id: string) {
  try {
    if (!id) {
      throw new Error("Task ID is required");
    }

    const task = await prisma.rnDTeamTask.findUnique({
      where: { id: id },
      include: { owner: true },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  } catch (error) {
    throw new Error(`Error fetching RND task: ${(error as Error).message}`);
  }
}

/**
 * Create a new RND task
 */
export async function createRndTask(data: any) {
  try {
    const { owner, ...taskData } = data;

    const newTask = await prisma.rnDTeamTask.create({
      data: {
        ...taskData,
        owner: {
          connect: { id: owner.id },
        },
      },
    });

    // revalidatePath("/");
    return newTask;
  } catch (error) {
    throw new Error(`Error creating RND task: ${(error as Error).message}`);
  }
}

/**
 * Update an existing RND task
 */
export async function updateRndTask(data: any) {
  try {
    const { id, owner, ownerId: _ownerId, ...updateData } = data;

    // Prepare the update object
    const updateObject: any = {
      ...updateData,
    };

    // Set up the owner relation
    if (owner && owner.id) {
      updateObject.owner = {
        connect: { id: owner.id },
      };
    }

    // Remove fields that should not be directly updated
    delete updateObject.createdAt;

    const updatedTask = await prisma.rnDTeamTask.update({
      where: { id },
      data: updateObject,
    });

    // revalidatePath("/");
    return updatedTask;
  } catch (error) {
    throw new Error(`Error updating RND task: ${(error as Error).message}`);
  }
}

/**
 * Delete an RND task
 */
export async function deleteRndTask(id: string) {
  try {
    await prisma.rnDTeamTask.delete({
      where: { id },
    });

    // revalidatePath("/");
    return { success: true };
  } catch (error) {
    throw new Error(`Error deleting RND task: ${(error as Error).message}`);
  }
}

/**
 * Get all R&D team members
 */
export async function getRndUsers(): Promise<UserSchema[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        isRnDTeam: true,
      },
      include: {
        rndTasks: {
          include: {
            owner: true,
          },
        },
      },
    });

    // Break circular references by using a type assertion
    // This allows us to convert the Prisma result to the expected interface
    // without creating an infinite loop of references
    return users as unknown as UserSchema[];
  } catch (error) {
    throw new Error(`Error fetching R&D users: ${(error as Error).message}`);
  }
}

/**
 * Get a specific R&D team member by ID
 */
export async function getRndUserById(id: string): Promise<UserSchema> {
  try {
    if (!id) {
      throw new Error("User ID is required");
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        isRnDTeam: true,
      },
      include: {
        rndTasks: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found or not part of R&D team");
    }

    return user as unknown as UserSchema;
  } catch (error) {
    throw new Error(`Error fetching R&D user: ${(error as Error).message}`);
  }
}
