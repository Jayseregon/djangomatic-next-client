-- CreateTable
CREATE TABLE "ChecklistRow" (
    "id" TEXT NOT NULL,
    "code" DOUBLE PRECISION NOT NULL,
    "item" TEXT NOT NULL,
    "isChecked" BOOLEAN,
    "comments" TEXT,
    "form4Id" TEXT,
    "form5Id" TEXT,
    "form6Id" TEXT,
    "form7Id" TEXT,
    "form8Id" TEXT,
    "form9Id" TEXT,
    "form10Id" TEXT,
    "form11Id" TEXT,

    CONSTRAINT "ChecklistRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistForm4" (
    "id" TEXT NOT NULL,
    "towerReportId" TEXT NOT NULL,

    CONSTRAINT "ChecklistForm4_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistForm5" (
    "id" TEXT NOT NULL,
    "towerReportId" TEXT NOT NULL,

    CONSTRAINT "ChecklistForm5_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistForm6" (
    "id" TEXT NOT NULL,
    "towerReportId" TEXT NOT NULL,

    CONSTRAINT "ChecklistForm6_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistForm7" (
    "id" TEXT NOT NULL,
    "towerReportId" TEXT NOT NULL,

    CONSTRAINT "ChecklistForm7_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistForm8" (
    "id" TEXT NOT NULL,
    "towerReportId" TEXT NOT NULL,

    CONSTRAINT "ChecklistForm8_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistForm9" (
    "id" TEXT NOT NULL,
    "towerReportId" TEXT NOT NULL,

    CONSTRAINT "ChecklistForm9_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistForm10" (
    "id" TEXT NOT NULL,
    "towerReportId" TEXT NOT NULL,

    CONSTRAINT "ChecklistForm10_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistForm11" (
    "id" TEXT NOT NULL,
    "towerReportId" TEXT NOT NULL,

    CONSTRAINT "ChecklistForm11_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm4Rows_form4Id_fkey" FOREIGN KEY ("form4Id") REFERENCES "ChecklistForm4"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm5Rows_form5Id_fkey" FOREIGN KEY ("form5Id") REFERENCES "ChecklistForm5"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm6Rows_form6Id_fkey" FOREIGN KEY ("form6Id") REFERENCES "ChecklistForm6"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm7Rows_form7Id_fkey" FOREIGN KEY ("form7Id") REFERENCES "ChecklistForm7"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm8Rows_form8Id_fkey" FOREIGN KEY ("form8Id") REFERENCES "ChecklistForm8"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm9Rows_form9Id_fkey" FOREIGN KEY ("form9Id") REFERENCES "ChecklistForm9"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm10Rows_form10Id_fkey" FOREIGN KEY ("form10Id") REFERENCES "ChecklistForm10"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistRow" ADD CONSTRAINT "ChecklistForm11Rows_form11Id_fkey" FOREIGN KEY ("form11Id") REFERENCES "ChecklistForm11"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistForm4" ADD CONSTRAINT "ChecklistForm4_towerReportId_fkey" FOREIGN KEY ("towerReportId") REFERENCES "TowerReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistForm5" ADD CONSTRAINT "ChecklistForm5_towerReportId_fkey" FOREIGN KEY ("towerReportId") REFERENCES "TowerReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistForm6" ADD CONSTRAINT "ChecklistForm6_towerReportId_fkey" FOREIGN KEY ("towerReportId") REFERENCES "TowerReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistForm7" ADD CONSTRAINT "ChecklistForm7_towerReportId_fkey" FOREIGN KEY ("towerReportId") REFERENCES "TowerReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistForm8" ADD CONSTRAINT "ChecklistForm8_towerReportId_fkey" FOREIGN KEY ("towerReportId") REFERENCES "TowerReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistForm9" ADD CONSTRAINT "ChecklistForm9_towerReportId_fkey" FOREIGN KEY ("towerReportId") REFERENCES "TowerReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistForm10" ADD CONSTRAINT "ChecklistForm10_towerReportId_fkey" FOREIGN KEY ("towerReportId") REFERENCES "TowerReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistForm11" ADD CONSTRAINT "ChecklistForm11_towerReportId_fkey" FOREIGN KEY ("towerReportId") REFERENCES "TowerReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
