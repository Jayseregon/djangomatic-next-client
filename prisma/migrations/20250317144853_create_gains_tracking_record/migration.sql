-- CreateEnum
CREATE TYPE "FiscalMonths" AS ENUM ('December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November');

-- CreateEnum
CREATE TYPE "GainTrackingStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');

-- AlterTable
ALTER TABLE "RnDTeamTask" ADD COLUMN     "trackGains" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "GainsTrackingRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taskId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "implementationDate" TIMESTAMP(3) NOT NULL,
    "region" TEXT,
    "hasGains" BOOLEAN NOT NULL DEFAULT false,
    "replaceOffshore" BOOLEAN NOT NULL DEFAULT false,
    "timeInitial" INTEGER NOT NULL DEFAULT 0,
    "timeSaved" INTEGER NOT NULL DEFAULT 0,
    "comments" TEXT,
    "status" "GainTrackingStatus" NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "GainsTrackingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyCostRecord" (
    "id" TEXT NOT NULL,
    "gainsRecordId" TEXT NOT NULL,
    "fiscalYear" INTEGER NOT NULL,
    "month" "FiscalMonths" NOT NULL,
    "cost" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MonthlyCostRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GainsTrackingRecord_taskId_key" ON "GainsTrackingRecord"("taskId");

-- AddForeignKey
ALTER TABLE "GainsTrackingRecord" ADD CONSTRAINT "GainsTrackingRecord_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "RnDTeamTask"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyCostRecord" ADD CONSTRAINT "MonthlyCostRecord_gainsRecordId_fkey" FOREIGN KEY ("gainsRecordId") REFERENCES "GainsTrackingRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
