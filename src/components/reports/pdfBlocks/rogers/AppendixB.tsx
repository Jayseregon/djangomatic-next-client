import { View, Text, Image as PdfImg } from "@react-pdf/renderer";

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

const AppendixB = ({
  tocSections,
  willCaptureToc,
  redlinePages,
}: {
  tocSections: TOCSections[];
  willCaptureToc: boolean;
  redlinePages: number;
}) => {
  const pages = [];

  // Page 1: Title page
  pages.push(
    <View key="appendix-b-page-1" wrap={false}>
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
    </View>,
  );

  // Define the list keys for each page
  const page2Lists: Array<keyof typeof checkingProceduresList> = [
    "listA",
    "listB",
    "listC",
    "listD",
  ];
  const page3Lists: Array<keyof typeof checkingProceduresList> = [
    "listE",
    "listF",
    "listG",
    "listH",
    "listI",
    "listJ",
    "listK",
  ];
  const page4Lists: Array<keyof typeof checkingProceduresList> = [
    "listL",
    "listM",
    "listN",
    "listO",
    "listP",
    "list161",
    "list162",
  ];
  const page5Lists: Array<keyof typeof checkingProceduresList> = [
    "list163",
    "list164",
    "list165",
    "list167",
    "list168",
    "list169",
  ];

  // Page 2: Introduction, side-by-side content, and lists A-D
  pages.push(
    <View key="appendix-b-page-2" wrap={false}>
      <Text style={StylesPDF.AppendixContentSectionIndent}>
        The following outlines the manner in which the tower and the site were
        checked during the course of the field inspection. This checking is in
        general conformity with the guidelines used in Appendix D of CSA
        Standard S37 Antennas, towers and antenna-supporting structures and the
        Rogers Network Standard. All checking is visual, except as noted
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

      {/* Render lists A-D */}
      {page2Lists.map((key) => {
        const list = checkingProceduresList[key];

        return (
          <View key={key} style={StylesPDF.AppendixContentSection}>
            <ListCheckingTitle
              letter={list.title.letter}
              title={list.title.title}
            />
            {"nestedItems" in list ? (
              <>
                {list.nestedItems.title.map((item, index) => (
                  <ListItem
                    key={`title-${index}`}
                    number={(index + 1).toString()}
                    text={item}
                  />
                ))}
                {list.nestedItems.items.map((item, index) => (
                  <SubListItem
                    key={`item-${index}`}
                    number={index.toString()}
                    text={item}
                  />
                ))}
              </>
            ) : (
              list.items.map((item, index) => (
                <ListItem
                  key={`item-${index}`}
                  number={(index + 1).toString()}
                  text={item}
                />
              ))
            )}
          </View>
        );
      })}
    </View>,
  );

  // Page 3: Lists E-K
  pages.push(
    <View key="appendix-b-page-3" wrap={false}>
      {/* Render lists E-K */}
      {page3Lists.map((key) => {
        const list = checkingProceduresList[key];

        return (
          <View key={key} style={StylesPDF.AppendixContentSection}>
            <ListCheckingTitle
              letter={list.title.letter}
              title={list.title.title}
            />
            {"nestedItems" in list ? (
              <>
                {list.nestedItems.title.map((item, index) => (
                  <ListItem
                    key={`title-${index}`}
                    number={(index + 1).toString()}
                    text={item}
                  />
                ))}
                {list.nestedItems.items.map((item, index) => (
                  <SubListItem
                    key={`item-${index}`}
                    number={index.toString()}
                    text={item}
                  />
                ))}
              </>
            ) : (
              list.items.map((item, index) => (
                <ListItem
                  key={`item-${index}`}
                  number={(index + 1).toString()}
                  text={item}
                />
              ))
            )}
          </View>
        );
      })}
    </View>,
  );

  // Page 4: Lists L-162
  pages.push(
    <View key="appendix-b-page-4" wrap={false}>
      {/* Render lists L-162 */}
      {page4Lists.map((key) => {
        const list = checkingProceduresList[key];

        return (
          <View key={key} style={StylesPDF.AppendixContentSection}>
            <ListCheckingTitle
              letter={list.title.letter}
              title={list.title.title}
            />
            {"nestedItems" in list ? (
              <>
                {list.nestedItems.title.map((item, index) => (
                  <ListItem
                    key={`title-${index}`}
                    number={(index + 1).toString()}
                    text={item}
                  />
                ))}
                {list.nestedItems.items.map((item, index) => (
                  <SubListItem
                    key={`item-${index}`}
                    number={index.toString()}
                    text={item}
                  />
                ))}
              </>
            ) : (
              list.items.map((item, index) => (
                <ListItem
                  key={`item-${index}`}
                  number={(index + 1).toString()}
                  text={item}
                />
              ))
            )}
          </View>
        );
      })}
    </View>,
  );

  // Page 5: Lists 163-169
  pages.push(
    <View key="appendix-b-page-5" wrap={false}>
      {/* Render lists 163-169 */}
      {page5Lists.map((key) => {
        const list = checkingProceduresList[key];

        return (
          <View key={key} style={StylesPDF.AppendixContentSection}>
            <ListCheckingTitle
              letter={list.title.letter}
              title={list.title.title}
            />
            {"nestedItems" in list ? (
              <>
                {list.nestedItems.title.map((item, index) => (
                  <ListItem
                    key={`title-${index}`}
                    number={(index + 1).toString()}
                    text={item}
                  />
                ))}
                {list.nestedItems.items.map((item, index) => (
                  <SubListItem
                    key={`item-${index}`}
                    number={index.toString()}
                    text={item}
                  />
                ))}
              </>
            ) : (
              list.items.map((item, index) => (
                <ListItem
                  key={`item-${index}`}
                  number={(index + 1).toString()}
                  text={item}
                />
              ))
            )}
          </View>
        );
      })}
    </View>,
  );

  return pages;
};

export default AppendixB;
