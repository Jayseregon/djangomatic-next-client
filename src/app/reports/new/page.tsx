"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { TowerReportForm } from "@/src/components/reports/TowerReportsForm";
import {
  TowerReport,
  TowerReportImage,
} from "@/src/components/reports/TowerReportsDashboard";
import { title } from "@/src/components/primitives";

export default function ReportFormPage() {
  const router = useRouter();
  const [report] = useState<Partial<TowerReport>>({});

  const handleSave = async (report: Partial<TowerReport>) => {
    try {
      const response = await fetch("/api/prisma-tower-report/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        throw new Error(`Failed to save report: ${response.statusText}`);
      }

      router.push("/reports");
    } catch (error) {
      console.error("Failed to save tower report:", error);
    }
  };

  const handleCancel = async (
    newlyUploadedImages: TowerReportImage[],
    subdir: string,
  ) => {
    for (const image of newlyUploadedImages) {
      try {
        await fetch(
          `/api/azure-report-images/delete?subdir=${subdir}&azureId=${image.azureId}`,
          {
            method: "DELETE",
          },
        );
      } catch (error) {
        console.error(
          `Failed to delete image from Azure: ${image.azureId}`,
          error,
        );
      }
    }
    router.push("/reports");
  };

  return (
    <div className="w-full">
      <h1 className={title()}>New Report</h1>
      <TowerReportForm
        report={report}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
}
