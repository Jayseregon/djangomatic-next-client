import React from "react";
import { Page, Text, View, Image as PdfImg } from "@react-pdf/renderer";

import { titleCase } from "@/src/lib/utils";
import { StylesPDF } from "@/styles/stylesPDF";
import { TowerReport } from "@/src/types/reports";

export default function FrontPage({ report }: { report: TowerReport }) {
  return (
    <Page
      size="LETTER"
      style={StylesPDF.page}>
      {/* Header TD Logo */}
      <PdfImg
        fixed
        src="./public/reports/telecon-design-logo.png"
        style={StylesPDF.pageTDLogo}
      />
      {/* Header Rogers Logo */}
      <PdfImg
        fixed
        src="./public/reports/rogers/rogers-logo.png"
        style={StylesPDF.pageClientLogo}
      />
      {/* QB Data */}
      <View style={StylesPDF.frontCoverSection}>
        <Text
          style={{
            textTransform: "uppercase",
            fontSize: 14,
          }}>
          post construction inspection report
        </Text>
        <Text style={{ padding: "5 0" }}>for</Text>
        <Text
          style={{
            fontSize: 18,
            textTransform: "capitalize",
          }}>
          rogers wireless
        </Text>
        <Text style={{ padding: "10 0" }}>
          {report.site_code} - {titleCase(report.tower_site_name)},{" "}
          {report.site_region}
        </Text>
        <Text style={{ textTransform: "capitalize", paddingTop: 20 }}>
          date report created:{" "}
          {report.updatedAt.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </View>
      {/* central front cover image */}
      <PdfImg
        fixed
        src={report.front_image.length > 0 ? report.front_image[0].url : "./public/static/landscape-placeholder.png"}
        style={StylesPDF.frontCoverImage}
      />
      {/* Disclaimer */}
      <View style={StylesPDF.frontCoverCredits}>
        <Text>
          PROPRIETARY AND CONFIDENTIAL INFORMATION. This document contains
          information confidential and proprietary to ROGERS COMMUNICATIONS
          PARTNERSHIP. The contents of this document may not be used, disclosed,
          or reproduced without the prior express written authorization of
          ROGERS COMMUNICATIONS PARTNERSHIP. In the event that reproduction of
          all or any part of this document is authorized by ROGERS
          COMMUNICATIONS PARTNERSHIP, reproduction of any section of this
          document must include this legend.
        </Text>
      </View>
      {/* Footer Rogers corner */}
      <PdfImg
        fixed
        src="./public/reports/rogers/rogers-footer.jpg"
        style={StylesPDF.pageImageFooter}
      />
    </Page>
  );
}
