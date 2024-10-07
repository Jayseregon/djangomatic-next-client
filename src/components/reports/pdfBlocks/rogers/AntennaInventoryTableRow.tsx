import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { AntennaTransmissionLine } from "@/src/types/reports";

const AntennaInventoryTableRow = ({
  items,
}: {
  items: AntennaTransmissionLine[];
}) => (
  <>
    {items.map((item, index) => (
      <View key={index} style={StylesPDF.trContainerA}>
        <View style={StylesPDF.trElevation}>
          <Text>{item.elevation}</Text>
        </View>
        <View style={StylesPDF.trAntenna}>
          <Text>
            ({item.quantity}) {item.equipment}
          </Text>
        </View>
        <View style={StylesPDF.trAzimuth}>
          <Text>{item.azimuth}</Text>
        </View>
        <View style={StylesPDF.trTxLine}>
          <Text>{item.tx_line}</Text>
        </View>
        <View style={StylesPDF.trOdu}>
          <Text>{item.odu}</Text>
        </View>
        <View style={StylesPDF.trCarrier}>
          <Text>{item.carrier}</Text>
        </View>
      </View>
    ))}
  </>
);

export default AntennaInventoryTableRow;
