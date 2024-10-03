"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { TowerReportForm } from "@/src/components/reports/TowerReportsForm";
import { TowerReport, TowerReportImage } from "@/src/types/reports";
import { title } from "@/src/components/primitives";

export default function ReportFormPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [report, setReport] = useState<TowerReport | null>(null);

  useEffect(() => {
    if (id) {
      async function fetchReport() {
        try {
          const response = await fetch(`/api/prisma-tower-report?id=${id}`);

          if (!response.ok) {
            throw new Error(`Failed to fetch report: ${response.statusText}`);
          }
          const data = await response.json();

          setReport(data);
        } catch (error) {
          console.error("Failed to fetch report:", error);
        }
      }
      fetchReport();
    }
  }, [id]);

  const handleSave = async (report: Partial<TowerReport>) => {
    try {
      const response = await fetch(`/api/prisma-tower-report/update?id=${id}`, {
        method: "PUT",
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
      <h1 className={title()}>Edit Report</h1>
      <TowerReportForm
        report={report}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </div>
  );
}
