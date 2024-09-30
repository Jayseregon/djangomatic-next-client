/*
  Warnings:

  - Added the required column `job_revision` to the `TowerReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TowerReport" ADD COLUMN     "job_revision" TEXT NOT NULL;
