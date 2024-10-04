import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { AntennaTransmissionLine } from "@/src/types/reports";
import { StylesPDF } from "@/styles/stylesPDF";

const AntennaInventoryTableRow = ({
  items,
}: {
  items: AntennaTransmissionLine[];
}) => {
  const rows = items.map((item: AntennaTransmissionLine) => (
    <View key={item.id} style={StylesPDF.trContainerA}>
      <Text style={StylesPDF.trElevation}>{item.elevation}</Text>
      <Text style={StylesPDF.trAntenna}>
        ({item.quantity}) {item.equipment}
      </Text>
      <Text style={StylesPDF.trAzimuth}>{item.azimuth}</Text>
      <Text style={StylesPDF.trTxLine}>{item.tx_line}</Text>
      <Text style={StylesPDF.trOdu}>{item.odu}</Text>
      <Text style={StylesPDF.trCarrier}>{item.carrier}</Text>
    </View>
  ));

  return <>{rows}</>;
};

export default AntennaInventoryTableRow;
