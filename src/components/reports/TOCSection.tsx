import React from "react";
import { Text } from "@react-pdf/renderer";

import { TOCSectionProps } from "@/src/interfaces/reports";

export const TOCSectionPDF = ({
  id,
  style,
  children,
  tocSections,
  willCaptureToc,
}: TOCSectionProps) => {
  if (!willCaptureToc) {
    return (
      <Text id={id} style={style}>
        {children}
      </Text>
    );
  } else {
    return (
      <Text
        id={id}
        render={({ pageNumber }) => {
          const title =
            React.isValidElement(children) &&
            typeof children.props.children === "string"
              ? children.props.children
              : String(children);

          // Remove any existing entry with the same title
          const existingIndex = tocSections.findIndex(
            (section) => section.title === title,
          );

          if (existingIndex !== -1) {
            tocSections.splice(existingIndex, 1);
          }

          // Add the new entry with the current page number
          tocSections.push({ title, pageNumber });

          return children;
        }}
        style={style}
      />
    );
  }
};
