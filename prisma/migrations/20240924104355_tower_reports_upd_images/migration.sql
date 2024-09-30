/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_projectId_fkey";

-- DropTable
DROP TABLE "Image";

-- CreateTable
CREATE TABLE "TowerReportImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "TowerReportImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TowerReportImage" ADD CONSTRAINT "TowerReportImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "TowerReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
