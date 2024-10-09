import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";

const AppendixCHeader = () => (
  <View style={StylesPDF.thContainerC}>
    <Text style={StylesPDF.thCode}>Code</Text>
    <Text style={StylesPDF.thItem}>Item</Text>
    <Text style={StylesPDF.thYes}>Yes</Text>
    <Text style={StylesPDF.thNo}>No</Text>
    <Text style={StylesPDF.thNA}>N/A</Text>
    <Text style={StylesPDF.thComments}>Comments</Text>
  </View>
);

export default AppendixCHeader;
