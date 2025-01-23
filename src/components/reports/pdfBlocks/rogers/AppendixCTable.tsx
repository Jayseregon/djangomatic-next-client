import React from "react";
import { View } from "@react-pdf/renderer";

import { ChecklistRow, ListItem } from "@/src/interfaces/reports";
import { StylesPDF } from "@/styles/stylesPDF";

import AppendixCHeader from "./AppendixCHeader";
import AppendixCRow from "./AppendixCRow";
import AppendixCTopHeader from "./AppendixCTopHeader";

const AppendixCTable: React.FC<{
  items: ChecklistRow[];
  list: ListItem[];
  formNb: string;
  type: string;
  title: string;
}> = ({ items, list, formNb, type, title }) => (
  <View style={StylesPDF.tableContainer}>
    <AppendixCTopHeader formNb={formNb} title={title} type={type} />
    <AppendixCHeader />
    <AppendixCRow items={items} list={list} />
  </View>
);

export default AppendixCTable;
