import { View, Text } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { parseTextBold } from "@/lib/pdfRenderUtils";

export const ListTitle = ({ title }: { title: string }) => {
  return <Text style={StylesPDF.listTitle}>{title}</Text>;
};

export const ListCheckingTitle = ({
  letter,
  title,
}: {
  letter: string;
  title: string;
}) => {
  return (
    <Text style={StylesPDF.listTitleBold}>
      Checking Procedure {letter.toUpperCase()} - {title}
    </Text>
  );
};

export const ListItem = ({
  number,
  text,
}: {
  number: number | string;
  text: string;
}) => {
  return (
    <View style={StylesPDF.listItemContainer}>
      <Text style={StylesPDF.listItemNumber}>{number}.</Text>
      <Text style={StylesPDF.listItemText}>{parseTextBold(text)}</Text>
    </View>
  );
};

export const SubListItem = ({
  number,
  text,
}: {
  number: string;
  text: string;
}) => {
  const indexToLetter = (index: number): string => {
    return String.fromCharCode(97 + index); // 97 is the ASCII code for 'a'
  };
  const letter = indexToLetter(parseInt(number));

  return (
    <View style={StylesPDF.subListItemContainer}>
      <Text style={StylesPDF.listItemNumber}>{letter}.</Text>
      <Text style={StylesPDF.listItemText}>{text}</Text>
    </View>
  );
};
