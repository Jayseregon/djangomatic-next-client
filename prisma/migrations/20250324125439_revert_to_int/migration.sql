/*
  Warnings:

  - You are about to alter the column `cost` on the `MonthlyCostRecord` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `adjustedCost` on the `MonthlyCostRecord` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - You are about to alter the column `rate` on the `MonthlyCostRecord` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "MonthlyCostRecord" ALTER COLUMN "cost" SET DEFAULT 0,
ALTER COLUMN "cost" SET DATA TYPE INTEGER,
ALTER COLUMN "adjustedCost" SET DEFAULT 0,
ALTER COLUMN "adjustedCost" SET DATA TYPE INTEGER,
ALTER COLUMN "rate" SET DEFAULT 0,
ALTER COLUMN "rate" SET DATA TYPE INTEGER;
