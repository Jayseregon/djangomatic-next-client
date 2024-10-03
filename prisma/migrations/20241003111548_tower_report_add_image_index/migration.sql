/*
  Warnings:

  - Added the required column `index` to the `TowerReportImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TowerReportImage" ADD COLUMN     "index" INTEGER NOT NULL;
