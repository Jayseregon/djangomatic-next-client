-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canAccessDocsCogeco" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessDocsVistabeam" BOOLEAN NOT NULL DEFAULT false;
