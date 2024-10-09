import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";

const AppendixCTopHeader: React.FC<{
  formNb: string;
  type: string;
  title: string;
}> = ({ formNb, type, title }) => (
  <View style={StylesPDF.thContainerCTitle}>
    <Text style={StylesPDF.thTopTitle}>
      FORM {formNb}: {type} - {title}
    </Text>
  </View>
);

export default AppendixCTopHeader;
