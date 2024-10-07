import React from "react";
import { View } from "@react-pdf/renderer";

import { TowerReportImage } from "@/src/types/reports";
import { StylesPDF } from "@/styles/stylesPDF";

import DeficienciesTableHeader from "./DeficienciesTableHeader";
import DeficienciesTableRow from "./DeficienciesTableRow";

const DeficienciesTable: React.FC<{ items: TowerReportImage[] }> = ({
  items,
}) => (
  <View style={StylesPDF.tableContainer}>
    <DeficienciesTableHeader />
    <DeficienciesTableRow items={items} />
  </View>
);

export default DeficienciesTable;
