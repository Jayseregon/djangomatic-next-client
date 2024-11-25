-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "indexNumber" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "towerReportAntennaId" TEXT,
    "towerReportDeficiencyId" TEXT,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "AntennaNotes_towerReportAntennaId_fkey" FOREIGN KEY ("towerReportAntennaId") REFERENCES "TowerReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "DeficiencyNotes_towerReportDeficiencyId_fkey" FOREIGN KEY ("towerReportDeficiencyId") REFERENCES "TowerReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
