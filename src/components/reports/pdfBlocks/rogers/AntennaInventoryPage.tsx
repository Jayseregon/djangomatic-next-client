import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import {
  AntennaTransmissionLine,
  TOCSections,
  Note,
} from "@/src/interfaces/reports";

import TOCSectionPDF from "./TOCSection";
import { ListTitle } from "./ListElements";
import AntennaInventoryTable from "./AntennaInventoryTable";
import PageNotes from "./PageNotes";

const AntennaInventoryPage = ({
  antennaNotes,
  antennaInventory,
  tocSections,
  willCaptureToc,
}: {
  antennaNotes: Note[];
  antennaInventory: AntennaTransmissionLine[];
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) => {
  return (
    <View>
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
      <View style={[StylesPDF.PageNotesContentSection, { paddingTop: 30 }]}>
        <ListTitle title="Notes:" />
        <PageNotes items={antennaNotes} />
      </View>
    </View>
  );
};

export default AntennaInventoryPage;
