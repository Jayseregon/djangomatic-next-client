import React from "react";
import { Page, Text, View, Image as PdfImg } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections, TowerReport } from "@/src/types/reports";

import TOCSectionPDF from "./TOCSection";
import DeficienciesTable from "./DeficienciesTable";
import PageFooter from "./PageFooter";
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
  const sortedImages = [
    ...report.deficiency_images.sort((a, b) => a.imgIndex - b.imgIndex),
  ];

  return (
    <>
      <Page size="LETTER" style={StylesPDF.page}>
        <View>
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
          <View style={[StylesPDF.PageNotesContentSection, { paddingTop: 30 }]}>
            <ListTitle title="Additonal comments:" />
            <PageNotes items={report.notes_deficiency} />
          </View>
        </View>
        <PageFooter redlinePages={report.redline_pages} />
      </Page>

      <Page size="LETTER" style={StylesPDF.page}>
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
        <PageFooter redlinePages={report.redline_pages} />
      </Page>

      {sortedImages.map((image, index) => (
        <Page key={index} size="LETTER" style={StylesPDF.page}>
          <View key={index} style={StylesPDF.imageColumn}>
            <View style={StylesPDF.imageContainer}>
              <PdfImg
                src={`/api/proxy-image?url=${encodeURIComponent(image.url)}`}
                style={StylesPDF.image}
              />
              <Text style={StylesPDF.label}>
                {image.imgIndex + 1 + ". " + image.label}
              </Text>
            </View>
          </View>
          <PageFooter redlinePages={report.redline_pages} />
        </Page>
      ))}
    </>
  );
};

export default DeficienciesPage;
