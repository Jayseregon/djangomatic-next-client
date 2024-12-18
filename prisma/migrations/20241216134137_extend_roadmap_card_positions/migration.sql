/*
  Warnings:

  - You are about to drop the column `position` on the `RoadmapProject` table. All the data in the column will be lost.
  - You are about to drop the `_CardProjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CardProjects" DROP CONSTRAINT "_CardProjects_A_fkey";

-- DropForeignKey
ALTER TABLE "_CardProjects" DROP CONSTRAINT "_CardProjects_B_fkey";

-- AlterTable
ALTER TABLE "RoadmapProject" DROP COLUMN "position";

-- DropTable
DROP TABLE "_CardProjects";

-- CreateTable
CREATE TABLE "RoadmapProjectCard" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RoadmapProjectCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoadmapProjectCard_projectId_cardId_key" ON "RoadmapProjectCard"("projectId", "cardId");

-- AddForeignKey
ALTER TABLE "RoadmapProjectCard" ADD CONSTRAINT "RoadmapProjectCard_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "RoadmapProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadmapProjectCard" ADD CONSTRAINT "RoadmapProjectCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "RoadmapCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
