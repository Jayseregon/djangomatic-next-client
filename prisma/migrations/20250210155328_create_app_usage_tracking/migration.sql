-- CreateTable
CREATE TABLE "AppUsageTracking" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "app_name" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "elapsed_time" TEXT NOT NULL DEFAULT '0s',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppUsageTracking_pkey" PRIMARY KEY ("id")
);
