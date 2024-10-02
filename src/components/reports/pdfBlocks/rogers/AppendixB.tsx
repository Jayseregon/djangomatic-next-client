import { View } from "@react-pdf/renderer";

import { TOCSectionPDF } from "@/src/components/reports/TOCSection";
import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections } from "@/src/types/reports";

export default function AppendixB({
  tocSections,
  willCaptureToc,
}: {
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) {
  return (
    <View style={StylesPDF.sectionTitleContainer}>
      <TOCSectionPDF
        id="appendix-b"
        style={StylesPDF.pageTitle}
        tocSections={tocSections}
        willCaptureToc={willCaptureToc}
      >
        Appendix B
      </TOCSectionPDF>
      <TOCSectionPDF
        id="field-inspection-checking-procedures"
        style={StylesPDF.pageTitle}
        tocSections={tocSections}
        willCaptureToc={willCaptureToc}
      >
        Field Inspection Checking Procedures
      </TOCSectionPDF>
    </View>
  );
}
