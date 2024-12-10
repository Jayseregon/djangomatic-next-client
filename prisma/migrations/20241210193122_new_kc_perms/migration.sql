-- AlterTable
ALTER TABLE "User" ADD COLUMN     "canAccessDocsKC" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAccessDocsKCSecure" BOOLEAN NOT NULL DEFAULT false;
