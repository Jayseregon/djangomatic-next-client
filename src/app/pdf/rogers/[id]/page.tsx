"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Font, BlobProvider } from "@react-pdf/renderer";
import { Button } from "@nextui-org/button";

import { TowerReport, TOCSections } from "@/src/types/reports";
import { LoadingContent } from "@/components/ui/LoadingContent";
import { UnAuthorized } from "@/components/auth/unAuthorized";
import ReportDocument from "@/components/reports/pdfBlocks/rogers/ReportDocument";
import { titleCase } from "@/src/lib/utils";

// disable hyphenation
Font.registerHyphenationCallback((word) => [word]);

export default function PDFViewerPage() {
  const params = useParams();
  const [report, setReport] = useState<TowerReport | null>(null);
  const [tocSections, setTocSections] = useState<TOCSections[]>([]);

  // Moved useEffect before the conditional return
  useEffect(() => {
    if (!params.id) return; // Exit early if params.id is undefined

    const fetchReport = async () => {
      try {
        const response = await fetch(
          `/api/prisma-tower-report?id=${params.id}`,
        );
        const data = await response.json();

        // Transform the checklist forms to ensure isChecked is boolean | undefined >> prisma boolean? type defaults to null
        const transformChecklistForm = (form: any[]) =>
          form.map((item) => ({
            ...item,
            isChecked: item.isChecked === null ? undefined : item.isChecked,
          }));

        const transformedReport = {
          ...data,
          // Ensure date fields are properly converted
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
          // Transform checklist forms
          checklistForm4: transformChecklistForm(data.checklistForm4),
          checklistForm5: transformChecklistForm(data.checklistForm5),
          checklistForm6: transformChecklistForm(data.checklistForm6),
          checklistForm7: transformChecklistForm(data.checklistForm7),
          checklistForm8: transformChecklistForm(data.checklistForm8),
          checklistForm9: transformChecklistForm(data.checklistForm9),
          checklistForm10: transformChecklistForm(data.checklistForm10),
          checklistForm11: transformChecklistForm(data.checklistForm11),
        };

        setReport(transformedReport);
        setTocSections([]);
      } catch (error) {
        console.error("Failed to fetch report:", error);
      }
    };

    fetchReport();
  }, [params.id]);

  if (!params.id) {
    return <UnAuthorized />;
  }

  if (!report) {
    return <LoadingContent />;
  }

  const fileName = `${report.site_code}-${titleCase(report.tower_site_name)}-${report.site_region}-${report.jde_job}-PCI.pdf`;

  return (
    <BlobProvider
      document={
        <ReportDocument
          report={report}
          tocSections={tocSections}
          willCaptureToc={false}
        />
      }
    >
      {({ url, loading }) => {
        if (loading) {
          return <LoadingContent />;
        }

        const handleDownload = () => {
          const link = document.createElement("a");

          link.href = url!;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        return (
          <>
            <Button
              className="bg-primary text-white w-full w-1/2 h-10 mb-5"
              radius="full"
              variant="solid"
              onClick={handleDownload}
            >
              Download PDF
            </Button>
            <iframe
              className="w-full h-full"
              src={url!}
              title={`render-report-${report.id}`}
            />
          </>
        );
      }}
    </BlobProvider>
  );
}
