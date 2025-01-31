import React from "react";
import { Text, View } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { ChecklistRow, ListItem } from "@/src/interfaces/reports";

const AppendixCRow = ({
  items,
  list,
}: {
  items: ChecklistRow[];
  list: ListItem[];
}) => (
  <>
    {items.map((item, index) => {
      const listItem = list.find((listItem) => listItem.code === item.code);

      return (
        <View key={index} style={StylesPDF.trContainerC}>
          <View style={StylesPDF.trCode}>
            <Text>{item.code}</Text>
          </View>
          <View style={StylesPDF.trItem}>
            <Text>{listItem?.item}</Text>
          </View>
          <View style={StylesPDF.trYes}>
            {item.isChecked === true ? <Text>X</Text> : <Text />}
          </View>
          <View style={StylesPDF.trNo}>
            {item.isChecked === false ? <Text>X</Text> : <Text />}
          </View>
          <View style={StylesPDF.trNA}>
            {item.isChecked === undefined ? <Text>X</Text> : <Text />}
          </View>
          <View style={StylesPDF.trComments}>
            <Text>{item.comments}</Text>
          </View>
        </View>
      );
    })}
  </>
);

export default AppendixCRow;
