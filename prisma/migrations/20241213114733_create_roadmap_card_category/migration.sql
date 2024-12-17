/*
  Warnings:

  - You are about to drop the column `category` on the `RoadmapCard` table. All the data in the column will be lost.
  - Added the required column `roadmapCardCategoryId` to the `RoadmapCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RoadmapCard" DROP COLUMN "category",
ADD COLUMN     "roadmapCardCategoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RoadmapCardCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RoadmapCardCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoadmapCard" ADD CONSTRAINT "RoadmapCard_roadmapCardCategoryId_fkey" FOREIGN KEY ("roadmapCardCategoryId") REFERENCES "RoadmapCardCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
