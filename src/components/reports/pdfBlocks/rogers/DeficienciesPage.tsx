import React from "react";
import { Text, View, Image as PdfImg } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections, TowerReport } from "@/src/types/reports";

import TOCSectionPDF from "./TOCSection";
import DeficienciesTable from "./DeficienciesTable";

const DeficienciesPage = ({
  report,
  tocSections,
  willCaptureToc,
}: {
  report: TowerReport;
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) => {
  const sortedImages = [
    ...report.deficiency_images.sort((a, b) => a.imgIndex - b.imgIndex),
  ];

  return (
    <>
      <View break>
        <TOCSectionPDF
          id="summary-of-deficiencies"
          style={StylesPDF.pageTitle}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        >
          Summary of Deficiencies
        </TOCSectionPDF>
        <Text style={StylesPDF.PageContentSectionIndent}>
          The following is a list of deficiencies identified and referenced by
          the checking procedure in the appendix. Please refer to the detailed
          sheets for pictures.
        </Text>
        <DeficienciesTable items={report.deficiency_images} />
      </View>
      <View break style={StylesPDF.sectionTitleContainer}>
        <TOCSectionPDF
          id="deficiency-photos"
          style={StylesPDF.pageTitle}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        >
          Deficiency Photos
        </TOCSectionPDF>
      </View>
      {sortedImages.map((image, index) => (
        <View key={index} break style={StylesPDF.imageColumn}>
          <View style={StylesPDF.imageContainer}>
            <PdfImg src={image.url} style={StylesPDF.image} />
            <Text style={StylesPDF.label}>
              {image.imgIndex + 1 + ". " + image.label}
            </Text>
          </View>
        </View>
      ))}
    </>
  );
};

export default DeficienciesPage;
