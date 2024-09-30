/*
  Warnings:

  - You are about to drop the column `projectId` on the `TowerReportImage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TowerReportImage" DROP CONSTRAINT "SiteImages_projectId_fkey";

-- AlterTable
ALTER TABLE "TowerReportImage" DROP COLUMN "projectId",
ADD COLUMN     "deficiencyProjectId" TEXT,
ADD COLUMN     "frontProjectId" TEXT,
ADD COLUMN     "siteProjectId" TEXT;

-- AddForeignKey
ALTER TABLE "TowerReportImage" ADD CONSTRAINT "SiteImages_projectId_fkey" FOREIGN KEY ("siteProjectId") REFERENCES "TowerReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TowerReportImage" ADD CONSTRAINT "FrontImage_projectId_fkey" FOREIGN KEY ("frontProjectId") REFERENCES "TowerReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TowerReportImage" ADD CONSTRAINT "DeficiencyImages_projectId_fkey" FOREIGN KEY ("deficiencyProjectId") REFERENCES "TowerReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
