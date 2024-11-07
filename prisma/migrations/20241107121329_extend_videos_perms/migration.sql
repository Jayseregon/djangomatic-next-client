/*
  Warnings:

  - You are about to drop the column `canAccessVideoDefault` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `canAccessVideoQGIS` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "canAccessVideoDefault",
DROP COLUMN "canAccessVideoQGIS",
ADD COLUMN     "canAccessVideoAdmin" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canAccessVideoCAD" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canAccessVideoEng" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canAccessVideoGIS" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canAccessVideoLiDAR" BOOLEAN NOT NULL DEFAULT true;
