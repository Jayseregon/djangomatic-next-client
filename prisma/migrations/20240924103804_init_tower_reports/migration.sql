-- CreateTable
CREATE TABLE "TowerReport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jde_job" TEXT NOT NULL,
    "site_name" TEXT NOT NULL,
    "site_code" TEXT NOT NULL,
    "design_standard" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,

    CONSTRAINT "TowerReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "TowerReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
