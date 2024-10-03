/*
  Warnings:

  - You are about to drop the `_AntennaTransmissionLineToTowerReport` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `AntennaTransmissionLine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_AntennaTransmissionLineToTowerReport" DROP CONSTRAINT "_AntennaTransmissionLineToTowerReport_A_fkey";

-- DropForeignKey
ALTER TABLE "_AntennaTransmissionLineToTowerReport" DROP CONSTRAINT "_AntennaTransmissionLineToTowerReport_B_fkey";

-- AlterTable
ALTER TABLE "AntennaTransmissionLine" ADD COLUMN     "projectId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_AntennaTransmissionLineToTowerReport";

-- AddForeignKey
ALTER TABLE "AntennaTransmissionLine" ADD CONSTRAINT "AntennaTransmissionLine_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "TowerReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
