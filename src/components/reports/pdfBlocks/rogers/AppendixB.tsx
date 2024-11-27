import { Page, View, Text, Image as PdfImg } from "@react-pdf/renderer";

import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections } from "@/src/types/reports";
import sideImageList from "public/reports/rogers/appendixBSideImageList.json";
import checkingProceduresList from "public/reports/rogers/appendixBCheckingProceduresList.json";

import {
  ListTitle,
  ListItem,
  ListCheckingTitle,
  SubListItem,
} from "./ListElements";
import TOCSectionPDF from "./TOCSection";
import PageFooter from "./PageFooter";

const AppendixB = ({
  tocSections,
  willCaptureToc,
  redlinePages,
}: {
  tocSections: TOCSections[];
  willCaptureToc: boolean;
  redlinePages: number;
}) => {
  return (
    <Page size="LETTER" style={StylesPDF.page}>
      <View style={StylesPDF.sectionTitleContainer}>
        <TOCSectionPDF
          jumpRedlines
          id="appendix-b"
          redlinePages={redlinePages}
          style={StylesPDF.pageTitle}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        >
          Appendix B
        </TOCSectionPDF>
        <TOCSectionPDF
          jumpRedlines
          id="field-inspection-checking-procedures"
          redlinePages={redlinePages}
          style={StylesPDF.pageTitle}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        >
          Field Inspection Checking Procedures
        </TOCSectionPDF>
      </View>
      {/* Appendix Content */}
      <View>
        {/* Intro */}
        <Text style={StylesPDF.AppendixContentSectionIndent}>
          The following outlines the manner in which the tower and the site were
          checked during the course of the field inspection. This checking is in
          general conformity with the guidelines used in Appendix D of CSA
          Standard S37 Antennas, towers and antenna-supporting structures and
          the Rogers Network Standard. All checking is visual, except as noted
          otherwise.
        </Text>

        {/* Side by side lists & image */}
        <View style={StylesPDF.sideBySideContainer}>
          <View style={StylesPDF.sideBySideItem}>
            {Object.values(sideImageList).map((list, index) => (
              <View key={index} style={StylesPDF.AppendixContentSection}>
                <ListTitle title={list.title} />
                {list.items.map((item, itemIndex) => (
                  <ListItem
                    key={itemIndex}
                    number={(itemIndex + 1).toString()}
                    text={item}
                  />
                ))}
              </View>
            ))}
          </View>
          <View
            style={[
              StylesPDF.sideBySideItem,
              { alignSelf: "center", paddingLeft: 10 },
            ]}
          >
            <PdfImg
              src="/reports/rogers/tower-schema.jpg"
              style={StylesPDF.image}
            />
          </View>
        </View>

        {/* Checking procedures */}
        {Object.values(checkingProceduresList).map((list, index) => (
          <View key={index} style={StylesPDF.AppendixContentSection}>
            <ListCheckingTitle
              letter={list.title.letter}
              title={list.title.title}
            />
            {"nestedItems" in list ? (
              <>
                {list.nestedItems.title.map((item, itemIndex) => (
                  <ListItem
                    key={itemIndex}
                    number={(itemIndex + 1).toString()}
                    text={item}
                  />
                ))}
                {list.nestedItems.items.map((item, itemIndex) => (
                  <SubListItem
                    key={itemIndex}
                    number={itemIndex.toString()}
                    text={item}
                  />
                ))}
              </>
            ) : (
              list.items.map((item, itemIndex) => (
                <ListItem
                  key={itemIndex}
                  number={(itemIndex + 1).toString()}
                  text={item}
                />
              ))
            )}
          </View>
        ))}
      </View>
      <PageFooter jumpRedlines redlinePages={redlinePages} />
    </Page>
  );
};

export default AppendixB;
