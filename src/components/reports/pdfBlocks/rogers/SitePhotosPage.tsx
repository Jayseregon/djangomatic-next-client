import React from "react";
import { Text, View, Image as PdfImg } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections, TowerReport } from "@/src/types/reports";

import { TOCSectionPDF } from "./TOCSection";

export default function SitePhotosPage({
  report,
  tocSections,
  willCaptureToc,
}: {
  report: TowerReport;
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) {
  const siteImagePairs = [];

  for (let i = 0; i < report.site_images.length; i += 2) {
    siteImagePairs.push(report.site_images.slice(i, i + 2));
  }

  return (
    <>
      <View break style={StylesPDF.sectionTitleContainer}>
        <TOCSectionPDF
          id="site-photos"
          style={StylesPDF.pageTitle}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        >
          Site Photos
        </TOCSectionPDF>
      </View>
      {/* Dynamic display photos in pairs */}
      {siteImagePairs.map((pair, index) => (
        <View key={index} break style={StylesPDF.imageColumn}>
          {pair.map((image, idx) => (
            <View key={idx} style={StylesPDF.imageContainer}>
              <PdfImg src={image.url} style={StylesPDF.image} />
              <Text style={StylesPDF.label}>{image.label}</Text>
            </View>
          ))}
        </View>
      ))}
    </>
  );
}
