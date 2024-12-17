-- DropForeignKey
ALTER TABLE "RoadmapCard" DROP CONSTRAINT "RoadmapCard_roadmapCardCategoryId_fkey";

-- AlterTable
ALTER TABLE "RoadmapCard" ALTER COLUMN "roadmapCardCategoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RoadmapCard" ADD CONSTRAINT "CardCategory_roadmapCardCategoryId_fkey" FOREIGN KEY ("roadmapCardCategoryId") REFERENCES "RoadmapCardCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
