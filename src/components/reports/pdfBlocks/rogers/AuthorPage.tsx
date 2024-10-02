import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TowerReport } from "@/src/types/reports";

export default function AuthorPage({ report }: { report: TowerReport }) {
  return (
    <View style={StylesPDF.sectionAuthorContainer}>
      <Text
        style={{
          textTransform: "uppercase",
          fontFamily: "Helvetica-Bold",
          fontSize: 14,
        }}
      >
        post construction inspection report
      </Text>
      {/* QB data */}
      <Text style={{ padding: "10 0" }}>
        {report.site_code} - {report.tower_site_name}, {report.site_region}
      </Text>
      {/* Telecon */}
      <Text
        style={{
          textTransform: "uppercase",
          paddingTop: 50,
          paddingBottom: 10,
        }}
      >
        by:
      </Text>
      <Text style={{ textTransform: "uppercase" }}>Telecon Design Inc.</Text>
      <Text>7777 Weston Rd., Vaughan, ON</Text>
      {/* Rogers */}
      <Text
        style={{
          textTransform: "uppercase",
          paddingTop: 70,
          paddingBottom: 10,
        }}
      >
        presented to:
      </Text>
      <Text style={{ fontFamily: "Helvetica-Bold" }}>{report.client_name}</Text>
      <Text>Rogers Communications Inc</Text>
      <Text>8200 Dixie Rd</Text>
      <Text>Brampton, ON L6T 0C1</Text>
    </View>
  );
}
