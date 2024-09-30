/*
  Warnings:

  - You are about to drop the column `company` on the `TowerReport` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `TowerReport` table. All the data in the column will be lost.
  - Added the required column `client_company` to the `TowerReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jde_work_order` to the `TowerReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job_description` to the `TowerReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `site_region` to the `TowerReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tower_id` to the `TowerReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tower_name` to the `TowerReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tower_site_name` to the `TowerReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TowerReport" DROP COLUMN "company",
DROP COLUMN "name",
ADD COLUMN     "client_company" TEXT NOT NULL,
ADD COLUMN     "jde_work_order" TEXT NOT NULL,
ADD COLUMN     "job_description" TEXT NOT NULL,
ADD COLUMN     "site_region" TEXT NOT NULL,
ADD COLUMN     "tower_id" TEXT NOT NULL,
ADD COLUMN     "tower_name" TEXT NOT NULL,
ADD COLUMN     "tower_site_name" TEXT NOT NULL;
