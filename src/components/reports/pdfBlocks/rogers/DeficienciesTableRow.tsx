import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TowerReportImage } from "@/src/types/reports";

const DeficienciesTableRow = ({ items }: { items: TowerReportImage[] }) => (
  <>
    {items.map((item, index) => (
      <View key={index} style={StylesPDF.trContainerD}>
        <View style={StylesPDF.trItemNb}>
          <Text>{item.imgIndex + 1}</Text>
        </View>
        <View style={StylesPDF.trProcedure}>
          <Text>{item.deficiency_check_procedure}</Text>
        </View>
        <View style={StylesPDF.trDeficiency}>
          <Text>{item.label}</Text>
        </View>
        <View style={StylesPDF.trRecommendation}>
          <Text>{item.deficiency_recommendation}</Text>
        </View>
        <View style={StylesPDF.trPhoto}>
          <Text>{item.imgIndex + 1}</Text>
        </View>
      </View>
    ))}
  </>
);

export default DeficienciesTableRow;
