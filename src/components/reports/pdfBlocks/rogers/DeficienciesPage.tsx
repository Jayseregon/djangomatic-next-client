"use client";

import React, { useEffect, useState } from "react";
import { View, Text, Image as PdfImg } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections, TowerReport } from "@/src/types/reports";
import { fetchImageBatch } from "@/lib/pdfRenderUtils";

import TOCSectionPDF from "./TOCSection";
import DeficienciesTable from "./DeficienciesTable";
import { ListTitle } from "./ListElements";
import PageNotes from "./PageNotes";

const DeficienciesPage = ({
  report,
  tocSections,
  willCaptureToc,
}: {
  report: TowerReport;
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) => {
  const [imageDataUrls, setImageDataUrls] = useState<{ [key: string]: string }>(
    {},
  );

  useEffect(() => {
    const loadImages = async () => {
      const urlMap = await fetchImageBatch(report.deficiency_images);

      setImageDataUrls(urlMap);
    };

    loadImages();
  }, [report.deficiency_images]);

  const pages = [];
  const sortedImages = [...report.deficiency_images].sort(
    (a, b) => a.imgIndex - b.imgIndex,
  );

  // Summary Page
  pages.push(
    <View key="deficiency-summary" wrap={false}>
      <TOCSectionPDF
        id="summary-of-deficiencies"
        style={StylesPDF.pageTitle}
        tocSections={tocSections}
        willCaptureToc={willCaptureToc}
      >
        Summary of Deficiencies
      </TOCSectionPDF>
      <Text style={StylesPDF.PageContentSectionIndent}>
        The following is a list of deficiencies identified and referenced by the
        checking procedure in the appendix. Please refer to the detailed sheets
        for pictures.
      </Text>
      <DeficienciesTable items={report.deficiency_images} />
      <View style={[StylesPDF.PageNotesContentSection, { paddingTop: 30 }]}>
        <ListTitle title="Additional comments:" />
        <PageNotes items={report.notes_deficiency} />
      </View>
      {/* Footer can be added here if needed */}
    </View>,
  );

  // Deficiency Photos Introduction Page
  pages.push(
    <View key="deficiency-photos-intro" wrap={false}>
      <View style={StylesPDF.sectionTitleContainer}>
        <TOCSectionPDF
          id="deficiency-photos"
          style={StylesPDF.pageTitle}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        >
          Deficiency Photos
        </TOCSectionPDF>
      </View>
      {/* Footer can be added here if needed */}
    </View>,
  );

  // Deficiency Photos Pages
  sortedImages.forEach((image, index) => {
    pages.push(
      <View
        key={`deficiency-photo-${index}`}
        style={StylesPDF.imageColumn}
        wrap={false}
      >
        <View style={StylesPDF.imageContainer}>
          <PdfImg
            src={
              imageDataUrls[image.url] ||
              `/api/proxy-image?url=${encodeURIComponent(image.url)}`
            }
            style={StylesPDF.image}
          />
          <Text style={StylesPDF.label}>
            {image.imgIndex + 1 + ". " + image.label}
          </Text>
        </View>
        {/* Footer can be added here if needed */}
      </View>,
    );
  });

  return pages;
};

export default DeficienciesPage;
