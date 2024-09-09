/*
  Warnings:

  - You are about to drop the column `canAccessApps` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `canAccessDocs` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isUser` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "canAccessApps",
DROP COLUMN "canAccessDocs",
DROP COLUMN "isUser",
ADD COLUMN     "canAccessAppsXploreHLD" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessDocsTDS" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessDocsXplore" BOOLEAN NOT NULL DEFAULT false;
