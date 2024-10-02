import { View } from "@react-pdf/renderer";

import { TOCSectionPDF } from "@/src/components/reports/TOCSection";
import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections } from "@/src/types/reports";

export default function AppendixA({
  tocSections,
  willCaptureToc,
}: {
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) {
  return (
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
  );
}
