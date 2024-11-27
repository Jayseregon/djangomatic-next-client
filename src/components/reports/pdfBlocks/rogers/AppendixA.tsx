import { Page, View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections } from "@/src/types/reports";

import TOCSectionPDF from "./TOCSection";
import PageFooter from "./PageFooter";

const AppendixA = ({
  redlinePages,
  tocSections,
  willCaptureToc,
}: {
  redlinePages: number;
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) => {
  return (
    <Page size="LETTER" style={StylesPDF.page}>
      <View style={StylesPDF.sectionTitleContainer}>
        <TOCSectionPDF
          id="appendix-a"
          style={StylesPDF.pageTitle}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        >
          Appendix A
        </TOCSectionPDF>
        <TOCSectionPDF
          id="redline-of-construction-drawings"
          style={StylesPDF.pageTitle}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        >
          Redline of Construction Drawings
        </TOCSectionPDF>
      </View>
      <PageFooter redlinePages={redlinePages} />
    </Page>
  );
};

export default AppendixA;
