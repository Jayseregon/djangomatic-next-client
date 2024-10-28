-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATED', 'PENDING', 'BLOCKED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "RnDTeamTask" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "impactedPeople" TEXT NOT NULL,
    "comment" TEXT,
    "status" "Status" NOT NULL DEFAULT 'CREATED',
    "dueDate" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "RnDTeamTask_pkey" PRIMARY KEY ("id")
);
