/*
  Warnings:

  - You are about to drop the column `deficiency_check_procedure` on the `TowerReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TowerReport" DROP COLUMN "deficiency_check_procedure",
ALTER COLUMN "jde_job" DROP DEFAULT,
ALTER COLUMN "site_name" DROP DEFAULT,
ALTER COLUMN "site_code" DROP DEFAULT,
ALTER COLUMN "design_standard" DROP DEFAULT,
ALTER COLUMN "client_name" DROP DEFAULT,
ALTER COLUMN "client_company" DROP DEFAULT,
ALTER COLUMN "jde_work_order" DROP DEFAULT,
ALTER COLUMN "job_description" DROP DEFAULT,
ALTER COLUMN "site_region" DROP DEFAULT,
ALTER COLUMN "tower_id" DROP DEFAULT,
ALTER COLUMN "tower_name" DROP DEFAULT,
ALTER COLUMN "tower_site_name" DROP DEFAULT,
ALTER COLUMN "job_revision" DROP DEFAULT,
ALTER COLUMN "deficiency_recommendation" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TowerReportImage" ADD COLUMN     "deficiency_check_procedure" TEXT,
ADD COLUMN     "deficiency_recommendation" TEXT;
