import { Text } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";

export const parseTextBold = (text: string) => {
  const parts = text.split(/(\*\*[^\*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={index} style={StylesPDF.boldText}>
          {part.slice(2, -2)}
        </Text>
      );
    } else {
      return <Text key={index}>{part}</Text>;
    }
  });
};
