import { View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections } from "@/src/types/reports";

import { TOCSectionPDF } from "./TOCSection";

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
