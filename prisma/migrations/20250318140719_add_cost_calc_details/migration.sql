-- AlterTable
ALTER TABLE "MonthlyCostRecord" ADD COLUMN     "adjustedCost" INTEGER DEFAULT 0,
ADD COLUMN     "count" INTEGER DEFAULT 0,
ADD COLUMN     "rate" INTEGER DEFAULT 0;
