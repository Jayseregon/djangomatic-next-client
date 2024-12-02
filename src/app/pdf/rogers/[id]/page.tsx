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

// Disable hyphenation
Font.registerHyphenationCallback((word) => [word]);

// New component for PDF viewer
const PDFViewer = ({
  blob,
  fileName,
  reportId,
}: {
  blob: Blob | null;
  fileName: string;
  reportId: string;
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [blob]);

  const handleDownload = () => {
    if (!blob) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
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
        disabled={!blob}>
        Download PDF
      </Button>
      {pdfUrl && (
        <iframe
          className="w-full h-full"
          src={pdfUrl}
          title={`render-report-${reportId}`}
        />
      )}
    </>
  );
};

// Main component modifications
export default function PDFViewerPage() {
  const params = useParams();
  const [report, setReport] = useState<TowerReport | null>(null);
  const [tocSections, setTocSections] = useState<TOCSections[]>([]);
  const [isTocReady, setIsTocReady] = useState(false);

  useEffect(() => {
    if (!params.id) return;

    const fetchReport = async () => {
      try {
        const response = await fetch(
          `/api/prisma-tower-report?id=${params.id}`
        );
        const data = await response.json();

        // Transform the checklist forms to ensure isChecked is boolean | undefined
        const transformChecklistForm = (form: any[]) =>
          form.map((item) => ({
            ...item,
            isChecked: item.isChecked === null ? undefined : item.isChecked,
          }));

        const transformedReport = {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
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
      } catch (error) {
        console.error("Failed to fetch report:", error);
      }
    };

    fetchReport();
  }, [params.id]);

  useEffect(() => {
    const generateTocSections = async () => {
      if (!report) return;

      const newTocSections: TOCSections[] = [];
      // Create a document instance to populate TOC sections
      const doc = (
        <ReportDocument
          report={report}
          tocSections={newTocSections}
          willCaptureToc={true}
        />
      );

      // Use BlobProvider to force rendering and populate tocSections
      const instance = <BlobProvider document={doc}>{() => null}</BlobProvider>;

      // Since BlobProvider is asynchronous, we need to wait for it to render
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTocSections(newTocSections);
      setIsTocReady(true);
    };

    generateTocSections();
  }, [report]);

  if (!params.id) {
    return <UnAuthorized />;
  }

  if (!report || !isTocReady) {
    return <LoadingContent />;
  }

  const fileName = `${report.site_code}-${titleCase(
    report.tower_site_name
  )}-${report.site_region}-${report.jde_job}-PCI.pdf`;

  return (
    <BlobProvider
      document={
        <ReportDocument
          report={report}
          tocSections={tocSections}
          willCaptureToc={false}
        />
      }>
      {({ blob, url, loading, error }) => {
        if (loading) {
          return <LoadingContent />;
        }

        if (error) {
          return <div>Error generating PDF: {error.message}</div>;
        }

        return (
          <PDFViewer
            blob={blob}
            fileName={fileName}
            reportId={report.id}
          />
        );
      }}
    </BlobProvider>
  );
}
