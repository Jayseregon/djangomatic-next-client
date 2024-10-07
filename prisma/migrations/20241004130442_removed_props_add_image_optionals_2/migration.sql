/*
  Warnings:

  - Made the column `deficiency_check_procedure` on table `TowerReportImage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deficiency_recommendation` on table `TowerReportImage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TowerReportImage" ALTER COLUMN "deficiency_check_procedure" SET NOT NULL,
ALTER COLUMN "deficiency_recommendation" SET NOT NULL;
