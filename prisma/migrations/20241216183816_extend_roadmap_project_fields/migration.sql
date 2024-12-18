-- AlterTable
ALTER TABLE "RoadmapProject" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "members" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3);
