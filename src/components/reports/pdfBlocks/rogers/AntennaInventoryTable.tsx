import React from "react";
import { View } from "@react-pdf/renderer";

import { AntennaTransmissionLine } from "@/src/types/reports";
import { StylesPDF } from "@/styles/stylesPDF";

import AntennaInventoryTableHeader from "./AntennaInventoryTableHeader";
import AntennaInventoryTableRow from "./AntennaInventoryTableRow";

const AntennaInventoryTable = ({
  items,
}: {
  items: AntennaTransmissionLine[];
}) => (
  <View style={StylesPDF.tableContainer}>
    <AntennaInventoryTableHeader />
    <AntennaInventoryTableRow items={items} />
  </View>
);

export default AntennaInventoryTable;
