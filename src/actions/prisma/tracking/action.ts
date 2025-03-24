"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { GainTrackingStatus } from "@prisma/client";

import { prisma } from "@/src/lib/prismaClient";

export async function getAppTrackingEntries() {
  try {
    const items = await prisma.appUsageTracking.findMany({
      where: {
        status: "SUCCESS",
      },
    });

    return items;
  } catch (error) {
    throw new Error(
      `Error fetching tracking entries: ${(error as Error).message}`,
    );
  }
}

export async function getPciReportsEntries() {
  try {
    const items = await prisma.towerReport.findMany();

    return items;
  } catch (error) {
    throw new Error(`Error fetching PCI reports: ${(error as Error).message}`);
  }
}

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
    // console.log("Updated tracking entry:", record);

    revalidatePath("/");
  } catch (error) {
    throw new Error(
      `Error updating tracking entry: ${(error as Error).message}`,
    );
  }
}

// Fetch all gains tracking records
export async function getGainsTrackingRecords() {
  try {
    const records = await prisma.gainsTrackingRecord.findMany({
      include: {
        task: true,
        monthlyCosts: true,
      },
    });

    return records;
  } catch (error) {
    throw new Error(
      `Error fetching gains tracking records: ${(error as Error).message}`,
    );
  }
}

// Get available fiscal years for gains tracking data
export async function getGainsTrackingFiscalYears() {
  try {
    const years = await prisma.monthlyCostRecord.findMany({
      distinct: ["fiscalYear"],
      select: {
        fiscalYear: true,
      },
      orderBy: {
        fiscalYear: "desc",
      },
    });

    return years.map((y) => y.fiscalYear);
  } catch (error) {
    throw new Error(`Error fetching fiscal years: ${(error as Error).message}`);
  }
}

// Update or create a monthly cost for a gains record
export async function updateMonthlyCost(
  recordId: string,
  month: string,
  cost: number,
  count: number,
  rate: number,
  adjustedCost: number,
) {
  try {
    // Validate inputs
    const validRecordId = z.string().cuid().parse(recordId);
    const validMonth = z.string().parse(month);
    const validCost = z.number().nonnegative().parse(cost);
    const validCount = z.number().nonnegative().parse(count);
    const validRate = z.number().nonnegative().parse(rate);
    const validAdjustedCost = z.number().parse(adjustedCost);

    const fiscalYear = new Date().getFullYear();

    const record = await prisma.$transaction(async (tx) => {
      const existingRecord = await tx.monthlyCostRecord.findFirst({
        where: {
          gainsRecordId: validRecordId,
          month: validMonth as any,
          fiscalYear,
        },
      });

      if (existingRecord) {
        return tx.monthlyCostRecord.update({
          where: { id: existingRecord.id },
          data: {
            cost: validCost,
            count: validCount,
            rate: validRate,
            adjustedCost: validAdjustedCost,
          },
        });
      } else {
        return tx.monthlyCostRecord.create({
          data: {
            gainsRecordId: validRecordId,
            month: validMonth as any,
            fiscalYear,
            cost: validCost,
            count: validCount,
            rate: validRate,
            adjustedCost: validAdjustedCost,
          },
        });
      }
    });

    // Return record directly as plain numbers are stored in the DB
    return record;
  } catch (error) {
    throw new Error(`Error updating monthly cost: ${(error as Error).message}`);
  }
}

// Update a gains tracking record
export async function updateGainsRecord(
  recordId: string,
  data: {
    region?: string;
    hasGains?: boolean;
    replaceOffshore?: boolean;
    timeInitial?: number;
    timeSaved?: number;
    comments?: string;
    status?: GainTrackingStatus;
  },
) {
  try {
    // Validate inputs
    const validRecordId = z.string().cuid().parse(recordId);

    // Construct update data with only provided fields
    const updateData: any = {};

    if (data.region !== undefined) updateData.region = data.region;
    if (data.hasGains !== undefined) updateData.hasGains = data.hasGains;
    if (data.replaceOffshore !== undefined)
      updateData.replaceOffshore = data.replaceOffshore;
    if (data.timeInitial !== undefined)
      updateData.timeInitial = z.number().nonnegative().parse(data.timeInitial);
    if (data.timeSaved !== undefined)
      updateData.timeSaved = z.number().nonnegative().parse(data.timeSaved);
    if (data.comments !== undefined) updateData.comments = data.comments;
    if (data.status !== undefined) updateData.status = data.status;

    const updatedRecord = await prisma.gainsTrackingRecord.update({
      where: { id: validRecordId },
      data: updateData,
    });

    return updatedRecord;
  } catch (error) {
    throw new Error(`Error updating gains record: ${(error as Error).message}`);
  }
}
