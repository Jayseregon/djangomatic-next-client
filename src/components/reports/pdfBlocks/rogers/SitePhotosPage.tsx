"use client";

import React, { useEffect, useState } from "react";
import { View, Text, Image as PdfImg } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections, TowerReport } from "@/src/types/reports";
import { fetchImageBatch } from "@/lib/pdfRenderUtils";

import TOCSectionPDF from "./TOCSection";

const SitePhotosPage = ({
  report,
  tocSections,
  willCaptureToc,
}: {
  report: TowerReport;
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}): React.ReactElement[] => {
  const [imageDataUrls, setImageDataUrls] = useState<{ [key: string]: string }>(
    {},
  );

  useEffect(() => {
    const loadImages = async () => {
      const urlMap = await fetchImageBatch(report.site_images);

      setImageDataUrls(urlMap);
    };

    loadImages();
  }, [report.site_images]);

  const sortedSiteImages = [...report.site_images].sort(
    (a, b) => a.imgIndex - b.imgIndex,
  );

  const siteImagePairs = sortedSiteImages.reduce(
    (pairs: any[][], image, index) => {
      if (index % 2 === 0) {
        pairs.push([image]);
      } else {
        pairs[pairs.length - 1].push(image);
      }

      return pairs;
    },
    [],
  );

  const introPage = (
    <View key="site-photos-intro" break wrap={false}>
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
    </View>
  );

  const photoPages = siteImagePairs.map((pair, index) => (
    <View
      key={`site-photo-pair-${index}`}
      break
      style={StylesPDF.imageColumn}
      wrap={false}
    >
      {pair.map((image, idx) => (
        <View key={`${index}-${idx}`} style={StylesPDF.imageContainer}>
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
      ))}
    </View>
  ));

  return [introPage, ...photoPages];
};

export default SitePhotosPage;
