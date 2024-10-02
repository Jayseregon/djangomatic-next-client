import { View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections } from "@/src/types/reports";

import { TOCSectionPDF } from "./TOCSection";

export default function AppendixC({
  tocSections,
  willCaptureToc,
}: {
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) {
  return (
    <View break style={StylesPDF.sectionTitleContainer}>
      <TOCSectionPDF
        id="appendix-c"
        style={StylesPDF.pageTitle}
        tocSections={tocSections}
        willCaptureToc={willCaptureToc}
      >
        Appendix C
      </TOCSectionPDF>
      <TOCSectionPDF
        id="post-construction-itemized-checklist"
        style={StylesPDF.pageTitle}
        tocSections={tocSections}
        willCaptureToc={willCaptureToc}
      >
        Post Construction Itemized Checklist
      </TOCSectionPDF>
    </View>
  );
}
