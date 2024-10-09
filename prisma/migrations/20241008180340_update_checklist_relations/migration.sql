/*
  Warnings:

  - You are about to drop the `ChecklistForm10` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChecklistForm11` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChecklistForm4` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChecklistForm5` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChecklistForm6` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChecklistForm7` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChecklistForm8` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChecklistForm9` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChecklistForm10" DROP CONSTRAINT "ChecklistForm10_towerReportId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistForm11" DROP CONSTRAINT "ChecklistForm11_towerReportId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistForm4" DROP CONSTRAINT "ChecklistForm4_towerReportId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistForm5" DROP CONSTRAINT "ChecklistForm5_towerReportId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistForm6" DROP CONSTRAINT "ChecklistForm6_towerReportId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistForm7" DROP CONSTRAINT "ChecklistForm7_towerReportId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistForm8" DROP CONSTRAINT "ChecklistForm8_towerReportId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistForm9" DROP CONSTRAINT "ChecklistForm9_towerReportId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistRow" DROP CONSTRAINT "ChecklistForm10Rows_form10Id_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistRow" DROP CONSTRAINT "ChecklistForm11Rows_form11Id_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistRow" DROP CONSTRAINT "ChecklistForm4Rows_form4Id_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistRow" DROP CONSTRAINT "ChecklistForm5Rows_form5Id_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistRow" DROP CONSTRAINT "ChecklistForm6Rows_form6Id_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistRow" DROP CONSTRAINT "ChecklistForm7Rows_form7Id_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistRow" DROP CONSTRAINT "ChecklistForm8Rows_form8Id_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistRow" DROP CONSTRAINT "ChecklistForm9Rows_form9Id_fkey";

-- DropTable
DROP TABLE "ChecklistForm10";

-- DropTable
DROP TABLE "ChecklistForm11";

-- DropTable
DROP TABLE "ChecklistForm4";

-- DropTable
DROP TABLE "ChecklistForm5";

-- DropTable
DROP TABLE "ChecklistForm6";

-- DropTable
DROP TABLE "ChecklistForm7";

-- DropTable
DROP TABLE "ChecklistForm8";

-- DropTable
DROP TABLE "ChecklistForm9";

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm4Rows_form4Id_fkey" FOREIGN KEY ("form4Id") REFERENCES "TowerReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm5Rows_form5Id_fkey" FOREIGN KEY ("form5Id") REFERENCES "TowerReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm6Rows_form6Id_fkey" FOREIGN KEY ("form6Id") REFERENCES "TowerReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm7Rows_form7Id_fkey" FOREIGN KEY ("form7Id") REFERENCES "TowerReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm8Rows_form8Id_fkey" FOREIGN KEY ("form8Id") REFERENCES "TowerReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm9Rows_form9Id_fkey" FOREIGN KEY ("form9Id") REFERENCES "TowerReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm10Rows_form10Id_fkey" FOREIGN KEY ("form10Id") REFERENCES "TowerReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm11Rows_form11Id_fkey" FOREIGN KEY ("form11Id") REFERENCES "TowerReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
