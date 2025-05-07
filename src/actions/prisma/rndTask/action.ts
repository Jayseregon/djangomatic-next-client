"use server";

import { prisma } from "@/src/lib/prismaClient";
import { UserSchema } from "@/src/interfaces/lib";
import { getFiscalMonth, getFiscalYear } from "@/src/lib/actionHelper";

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

    // Check if task is being completed and should track gains
    if (updateData.status === "COMPLETED") {
      // Get the current task to check if it already has a gains record
      const currentTask = await prisma.rnDTeamTask.findUnique({
        where: { id },
        include: {
          gains: true,
          owner: true, // Include owner relationship
        },
      });

      if (currentTask && !currentTask.gains) {
        // Determine the effective trackGains value
        // If trackGains is included in the update, use that value
        // Otherwise use the current value from the database
        const effectiveTrackGains =
          updateData.trackGains !== undefined
            ? updateData.trackGains
            : currentTask.trackGains;

        if (effectiveTrackGains === true) {
          // Create a new GainsTrackingRecord with task name and an initial MonthlyCostRecord
          const now = new Date();
          const fiscalYear = getFiscalYear(now);
          const fiscalMonth = getFiscalMonth(now);

          const newGainsRecord = await prisma.gainsTrackingRecord.create({
            data: {
              task: { connect: { id } },
              name: currentTask.task, // Copy task name to gains record
              taskOwner: currentTask.owner?.name || "", // Set taskOwner to the owner's name or empty string if owner is null
              // Also create initial monthly cost record
              monthlyCosts: {
                create: {
                  fiscalYear,
                  month: fiscalMonth,
                  cost: 0,
                  count: 0,
                  rate: 0,
                  adjustedCost: 0,
                },
              },
            },
            include: {
              monthlyCosts: true,
            },
          });

          if (!newGainsRecord) {
            throw new Error("Error creating gains record");
          }
        }
      }
    }

    const updatedTask = await prisma.rnDTeamTask.update({
      where: { id },
      data: updateObject,
      include: { gains: true }, // Include gains in response
    });

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
    // First check if there's a related GainsTrackingRecord
    const task = await prisma.rnDTeamTask.findUnique({
      where: { id },
      include: { gains: true },
    });

    // Use a transaction to ensure all related records are deleted
    await prisma.$transaction(async (tx: any) => {
      // If a gains record exists, delete it first (this will cascade to MonthlyCostRecords)
      if (task?.gains) {
        await tx.gainsTrackingRecord.delete({
          where: { id: task.gains.id },
        });
      }

      // Delete the task itself
      await tx.rnDTeamTask.delete({
        where: { id },
      });
    });

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
