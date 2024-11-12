/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `BugReport` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `BugReport` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `BugReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BugReport" DROP COLUMN "assignedAt",
DROP COLUMN "completedAt",
DROP COLUMN "createdAt",
ADD COLUMN     "assignedDate" TIMESTAMP(3),
ADD COLUMN     "completedDate" TIMESTAMP(3),
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
