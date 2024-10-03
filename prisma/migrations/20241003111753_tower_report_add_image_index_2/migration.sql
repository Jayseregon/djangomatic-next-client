/*
  Warnings:

  - You are about to drop the column `index` on the `TowerReportImage` table. All the data in the column will be lost.
  - Added the required column `imgIndex` to the `TowerReportImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TowerReportImage" DROP COLUMN "index",
ADD COLUMN     "imgIndex" INTEGER NOT NULL;
