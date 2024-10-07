import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";

const DeficienciesTableHeader = () => (
  <View style={StylesPDF.thContainerD}>
    <Text style={StylesPDF.thItemNb}>Item #</Text>
    <Text style={StylesPDF.thProcedure}>Checking Procedure</Text>
    <Text style={StylesPDF.thDeficiency}>Deficiency</Text>
    <Text style={StylesPDF.thRecommendation}>Recommendation</Text>
    <Text style={StylesPDF.thPhoto}>Ref. Photo #</Text>
  </View>
);

export default DeficienciesTableHeader;
