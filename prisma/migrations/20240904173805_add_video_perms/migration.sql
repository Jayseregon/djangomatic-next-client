-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canAccessVideoDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessVideoQGIS" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessVideoSttar" BOOLEAN NOT NULL DEFAULT false;
