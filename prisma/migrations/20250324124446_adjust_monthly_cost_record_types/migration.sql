/*
  Warnings:

  - You are about to alter the column `cost` on the `MonthlyCostRecord` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `adjustedCost` on the `MonthlyCostRecord` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - You are about to alter the column `rate` on the `MonthlyCostRecord` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "MonthlyCostRecord" ALTER COLUMN "cost" SET DEFAULT 0,
ALTER COLUMN "cost" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "adjustedCost" SET DEFAULT 0,
ALTER COLUMN "adjustedCost" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "rate" SET DEFAULT 0,
ALTER COLUMN "rate" SET DATA TYPE DECIMAL(10,2);
