-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canAccessGlobalAll" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessGlobalAtlantic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessGlobalCentral" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessGlobalQuebec" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessGlobalUSA" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessGlobalWest" BOOLEAN NOT NULL DEFAULT false;
