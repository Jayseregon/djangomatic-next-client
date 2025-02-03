import React from "react";
import { Text, View, Link } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections } from "@/src/interfaces/reports";

const TableOfContentsPage = ({
  tocSections,
}: {
  tocSections: TOCSections[];
}) => {
  const generateDots = (
    title: string,
    pageNumber: number,
    containerWidth: number,
    fontSize: number,
  ) => {
    const titleWidth = title.length * fontSize * 0.95; // Approximate width of the title
    const pageNumberWidth = `p.${pageNumber}`.length * fontSize * 0.7; // Approximate width of the page number
    const dotsWidth = containerWidth - titleWidth - pageNumberWidth;
    const dotsCount = Math.floor(dotsWidth / (fontSize * 0.6)); // Approximate width of a dot

    return ".".repeat(dotsCount > 0 ? dotsCount : 0);
  };

  return (
    <View>
      <Text id="table-of-contents" style={StylesPDF.pageTitle}>
        Table of contents
      </Text>
      {tocSections.map((section, index) => {
        const isAppendix = section.title.toLowerCase().startsWith("appendix");

        return isAppendix ? (
          <Text
            key={index}
            style={{
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            {section.title}
          </Text>
        ) : (
          <Link
            key={index}
            src={`#${section.title.replace(/\s+/g, "-").toLowerCase()}`}
            style={{ textDecoration: "none", color: "#000" }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                }}
              >
                {section.title}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  flexGrow: 1,
                  textAlign: "center",
                  overflow: "hidden",
                }}
              >
                {generateDots(section.title, section.pageNumber, 980, 12)}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  backgroundColor: "#fff",
                  paddingLeft: 5,
                }}
              >
                {`p.${section.pageNumber}`}
              </Text>
            </View>
          </Link>
        );
      })}
    </View>
  );
};

export default TableOfContentsPage;
