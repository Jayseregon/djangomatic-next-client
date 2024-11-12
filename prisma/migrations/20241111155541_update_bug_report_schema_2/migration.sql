/*
  Warnings:

  - The `priority` column on the `BugReport` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BugPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "BugReport" DROP COLUMN "priority",
ADD COLUMN     "priority" "BugPriority" NOT NULL DEFAULT 'LOW';
