import React from "react";
import { Text, View, Image as PdfImg } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections, TowerReport } from "@/src/types/reports";
import { TOCSectionPDF } from "@/src/components/reports/TOCSection";

export default function DeficienciesPage({
  report,
  tocSections,
  willCaptureToc,
}: {
  report: TowerReport;
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) {
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
        <Text style={StylesPDF.PageContentSection}>
          The following is a list of deficiencies identified and referenced by
          the checking procedure in the appendix. Please refer to the detailed
          sheets for pictures.
        </Text>
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
      {report.deficiency_images.map((image, index) => (
        <View key={index} break style={StylesPDF.imageColumn}>
          <View style={StylesPDF.imageContainer}>
            <PdfImg src={image.url} style={StylesPDF.image} />
            <Text style={StylesPDF.label}>{image.label}</Text>
          </View>
        </View>
      ))}
    </>
  );
}
