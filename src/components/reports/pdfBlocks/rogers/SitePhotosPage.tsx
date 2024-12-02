import React from "react";
import { View, Text, Image as PdfImg } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections, TowerReport } from "@/src/types/reports";

import TOCSectionPDF from "./TOCSection";

const SitePhotosPage = ({
  report,
  tocSections,
  willCaptureToc,
}: {
  report: TowerReport;
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) => {
  const pages = [];
  // Sort the site_images by imgIndex
  const sortedSiteImages = [...report.site_images].sort(
    (a, b) => a.imgIndex - b.imgIndex,
  );

  // Introduction Page
  pages.push(
    <View key="site-photos-intro" wrap={false}>
      <View style={StylesPDF.sectionTitleContainer}>
        <TOCSectionPDF
          id="site-photos"
          style={StylesPDF.pageTitle}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        >
          Site Photos
        </TOCSectionPDF>
      </View>
      {/* Footer can be added here if needed */}
    </View>,
  );

  // Group images into pairs
  const siteImagePairs = [];

  for (let i = 0; i < sortedSiteImages.length; i += 2) {
    siteImagePairs.push(sortedSiteImages.slice(i, i + 2));
  }

  // Create pages for each pair
  siteImagePairs.forEach((pair, index) => {
    pages.push(
      <View
        key={`site-photo-pair-${index}`}
        style={StylesPDF.imageColumn}
        wrap={false}
      >
        {pair.map((image, idx) => (
          <View key={idx} style={StylesPDF.imageContainer}>
            <PdfImg
              src={`/api/proxy-image?url=${encodeURIComponent(image.url)}`}
              style={StylesPDF.image}
            />
            <Text style={StylesPDF.label}>
              {image.imgIndex + 1 + ". " + image.label}
            </Text>
          </View>
        ))}
        {/* Footer can be added here if needed */}
      </View>,
    );
  });

  return pages;
};

export default SitePhotosPage;
