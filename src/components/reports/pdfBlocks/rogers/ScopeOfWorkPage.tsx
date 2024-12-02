import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections, TowerReport } from "@/src/types/reports";

import TOCSectionPDF from "./TOCSection";

const ScopeOfWorkPage = ({
  report,
  tocSections,
  willCaptureToc,
}: {
  report: TowerReport;
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) => {
  return (
    <View>
      <TOCSectionPDF
        id="scope-of-work"
        style={StylesPDF.pageTitle}
        tocSections={tocSections}
        willCaptureToc={willCaptureToc}>
        Scope of Work
      </TOCSectionPDF>
      <Text style={StylesPDF.PageContentSectionIndent}>
        Telecon Design Inc. has carried out an inspection field review of the
        new antenna installation in accordance with the field review
        recommendations of the latest {report.design_standard} standard.
      </Text>
      <Text style={StylesPDF.PageContentSection}>
        The installation was also checked for compliance with Rogers Post
        Construction Inspection requirements and site specific installation
        drawings by Telecon Design Inc.
      </Text>
      <Text style={StylesPDF.PageContentSection}>
        Reference project Nos. #{report.jde_job}
      </Text>
      <Text
        style={[
          StylesPDF.PageContentSection,
          { textTransform: "uppercase", paddingTop: 80 },
        ]}>
        Report approved by:
      </Text>
      <Text
        style={[
          StylesPDF.PageContentSection,
          { fontFamily: "Helvetica-Bold", paddingTop: 150 },
        ]}>
        {report.assigned_peng}
      </Text>
    </View>
  );
};

export default ScopeOfWorkPage;
