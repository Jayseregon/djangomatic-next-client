import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";

const AntennaInventoryTableHeader = () => (
  <View style={StylesPDF.thContainerA}>
    <Text style={StylesPDF.thElevation}>Elev. (m)</Text>
    <Text style={StylesPDF.thAntenna}>(Qty) Antenna/Equipment</Text>
    <Text style={StylesPDF.thAzimuth}>Az (°)</Text>
    <Text style={StylesPDF.thTxLine}>Tx. Lines</Text>
    <Text style={StylesPDF.thOdu}>ODUs</Text>
    <Text style={StylesPDF.thCarrier}>Carrier</Text>
  </View>
);

export default AntennaInventoryTableHeader;
