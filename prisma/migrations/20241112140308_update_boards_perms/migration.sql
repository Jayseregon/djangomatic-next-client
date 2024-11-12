/*
  Warnings:

  - You are about to drop the column `canAccessBoards` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "canAccessBoards",
ADD COLUMN     "canAccessBugReportBoard" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canAccessRoadmapBoard" BOOLEAN NOT NULL DEFAULT false;
