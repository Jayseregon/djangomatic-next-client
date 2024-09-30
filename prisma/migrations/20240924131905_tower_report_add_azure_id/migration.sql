/*
  Warnings:

  - Added the required column `azureId` to the `TowerReportImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TowerReportImage" ADD COLUMN     "azureId" TEXT NOT NULL;
