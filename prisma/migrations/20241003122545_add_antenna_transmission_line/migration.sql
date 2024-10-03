-- CreateTable
CREATE TABLE "AntennaTransmissionLine" (
    "id" TEXT NOT NULL,
    "elevation" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "equipment" TEXT NOT NULL,
    "azimuth" DOUBLE PRECISION NOT NULL,
    "tx_line" TEXT NOT NULL,
    "odu" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,

    CONSTRAINT "AntennaTransmissionLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AntennaTransmissionLineToTowerReport" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AntennaTransmissionLineToTowerReport_AB_unique" ON "_AntennaTransmissionLineToTowerReport"("A", "B");

-- CreateIndex
CREATE INDEX "_AntennaTransmissionLineToTowerReport_B_index" ON "_AntennaTransmissionLineToTowerReport"("B");

-- AddForeignKey
ALTER TABLE "_AntennaTransmissionLineToTowerReport" ADD CONSTRAINT "_AntennaTransmissionLineToTowerReport_A_fkey" FOREIGN KEY ("A") REFERENCES "AntennaTransmissionLine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AntennaTransmissionLineToTowerReport" ADD CONSTRAINT "_AntennaTransmissionLineToTowerReport_B_fkey" FOREIGN KEY ("B") REFERENCES "TowerReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
