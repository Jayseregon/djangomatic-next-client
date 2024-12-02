import { View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections } from "@/src/types/reports";

import TOCSectionPDF from "./TOCSection";

const AppendixA = ({
  tocSections,
  willCaptureToc,
}: {
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) => {
  const pages = [];

  // Content of Appendix A
  pages.push(
    <View key="appendix-a" wrap={false}>
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
      {/* Additional content can be added here */}
      {/* ...existing code... */}
    </View>,
  );

  return pages;
};

export default AppendixA;
