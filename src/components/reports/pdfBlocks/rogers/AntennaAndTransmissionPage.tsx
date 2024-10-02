import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections } from "@/src/types/reports";
import { TOCSectionPDF } from "@/src/components/reports/TOCSection";

export default function AntennaAndTransmissionPage({
  tocSections,
  willCaptureToc,
}: {
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) {
  return (
    <View break>
      <TOCSectionPDF
        id="antenna-and-transmission-line-inventory"
        style={StylesPDF.pageTitle}
        tocSections={tocSections}
        willCaptureToc={willCaptureToc}
      >
        Antenna and Transmission Line Inventory
      </TOCSectionPDF>
      <Text style={StylesPDF.PageContentSection}>
        During our field visit, we completed the following inventory of new
        antennas and transmission lines on the tower.
      </Text>

      <Text style={{ paddingTop: 30, paddingBottom: 5 }}>Notes:</Text>
      <View style={{ lineHeight: 1.5, paddingLeft: 5 }}>
        <Text>
          1. Antenna loading listed above are included in the installation SOW
        </Text>
        <Text>2. The azimuths are +/- 10</Text>
      </View>
    </View>
  );
}
