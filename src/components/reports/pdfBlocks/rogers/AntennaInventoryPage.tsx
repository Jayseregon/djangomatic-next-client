import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { AntennaTransmissionLine, TOCSections } from "@/src/types/reports";

import TOCSectionPDF from "./TOCSection";
import { ListTitle, ListItem } from "./ListElements";
import AntennaInventoryTable from "./AntennaInventoryTable";

const AntennaInventoryPage = ({
  antennaInventory,
  tocSections,
  willCaptureToc,
}: {
  antennaInventory: AntennaTransmissionLine[];
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) => {
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
      <Text style={StylesPDF.PageContentSectionIndent}>
        During our field visit, we completed the following inventory of new
        antennas and transmission lines on the tower.
      </Text>
      <AntennaInventoryTable items={antennaInventory} />
      <View style={[StylesPDF.PageContentSection, { paddingTop: 30 }]}>
        <ListTitle title="Notes:" />
        <ListItem
          number="1"
          text="Antenna loading listed above are included in the installation SOW"
        />
        <ListItem number="2" text="The azimuths are +/- 10" />
      </View>
    </View>
  );
};

export default AntennaInventoryPage;
