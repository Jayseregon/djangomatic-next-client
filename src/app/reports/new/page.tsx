"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { TowerReportForm } from "@/src/components/reports/TowerReportsForm";
import { TowerReport, TowerReportImage } from "@/src/types/reports";
import { title } from "@/src/components/primitives";

export default function ReportFormPage() {
  const router = useRouter();
  const [report] = useState<Partial<TowerReport>>({});

  const handleSaveAndClose = async (report: Partial<TowerReport>) => {
    try {
      const response = await fetch("/api/prisma-tower-report/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(report),
      });

      console.log("response", response);

      if (!response.ok) {
        throw new Error(`Failed to save report: ${response.statusText}`);
      }

      router.push("/reports");
    } catch (error) {
      console.error("Failed to save tower report:", error);
    }
  };

  const handleLocalSave = async (report: Partial<TowerReport>) => {
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

      const responseData = await response.json();
      const reportId = responseData.report.id;
      const successMessage = "Report successfully created and saved!";

      console.log("Inside handleLocalSave [new]: ", reportId);

      router.push(`/reports/${reportId}`);

      console.log("After router push");

      return { success: true, message: successMessage, id: reportId };
    } catch (error) {
      const errorMessage = `Failed to save tower report: ${(error as Error).message}`;

      console.error(errorMessage);

      return { success: false, message: errorMessage };
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
        onLocalSave={handleLocalSave}
        onSave={handleSaveAndClose}
      />
    </div>
  );
}
