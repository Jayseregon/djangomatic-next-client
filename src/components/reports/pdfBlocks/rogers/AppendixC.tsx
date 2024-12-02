import { View } from "@react-pdf/renderer";

import listForm4 from "public/reports/rogers/listForm4.json";
import listForm5 from "public/reports/rogers/listForm5.json";
import listForm6 from "public/reports/rogers/listForm6.json";
import listForm7 from "public/reports/rogers/listForm7.json";
import listForm8 from "public/reports/rogers/listForm8.json";
import listForm9 from "public/reports/rogers/listForm9.json";
import listForm10 from "public/reports/rogers/listForm10.json";
import listForm11 from "public/reports/rogers/listForm11.json";
import { StylesPDF } from "@/styles/stylesPDF";
import { TOCSections, TowerReport } from "@/src/types/reports";

import TOCSectionPDF from "./TOCSection";
import AppendixCTable from "./AppendixCTable";

const AppendixC = ({
  report,
  tocSections,
  willCaptureToc,
}: {
  report: TowerReport;
  tocSections: TOCSections[];
  willCaptureToc: boolean;
}) => {
  const pages = [];

  // Title Page for Appendix C
  pages.push(
    <View key="appendix-c" wrap={false}>
      <View style={StylesPDF.sectionTitleContainer}>
        <TOCSectionPDF
          jumpRedlines
          id="appendix-c"
          redlinePages={report.redline_pages}
          style={StylesPDF.pageTitle}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        >
          Appendix C
        </TOCSectionPDF>
        <TOCSectionPDF
          jumpRedlines
          id="post-construction-itemized-checklist"
          redlinePages={report.redline_pages}
          style={StylesPDF.pageTitle}
          tocSections={tocSections}
          willCaptureToc={willCaptureToc}
        >
          Post Construction Itemized Checklist
        </TOCSectionPDF>
      </View>
    </View>
  );

  // Split the checklistForm4 items if necessary
  const first20Items = report.checklistForm4.slice(0, 20);
  const remainingItems = report.checklistForm4.slice(20);

  // Form 4 - First Part
  pages.push(
    <View key="appendix-c-form4-1" wrap={false}>
      <AppendixCTable
        formNb="4"
        items={first20Items}
        list={listForm4}
        title="Antenna Structure and Site Works"
        type="Civil"
      />
    </View>
  );

  // Form 4 - Second Part (if any)
  if (remainingItems.length > 0) {
    pages.push(
      <View key="appendix-c-form4-2" wrap={false}>
        <AppendixCTable
          formNb="4"
          items={remainingItems}
          list={listForm4}
          title="Antenna Structure and Site Works - (Continued)"
          type="Civil"
        />
      </View>
    );
  }

  // Form 5
  pages.push(
    <View key="appendix-c-form5" wrap={false}>
      <AppendixCTable
        formNb="5"
        items={report.checklistForm5}
        list={listForm5}
        title="Electrical/Mechanical Alarm & Fire Protection Systems"
        type="Civil"
      />
    </View>
  );

  // Form 6
  pages.push(
    <View key="appendix-c-form6" wrap={false}>
      <AppendixCTable
        formNb="6"
        items={report.checklistForm6}
        list={listForm6}
        title="AC Power and Grounding"
        type="Civil"
      />
    </View>
  );

  // Form 7 and 8
  pages.push(
    <View key="appendix-c-form7-8" wrap={false}>
      <AppendixCTable
        formNb="7"
        items={report.checklistForm7}
        list={listForm7}
        title="Cable Tray and Overhead Support"
        type="Civil"
      />
      <AppendixCTable
        formNb="8"
        items={report.checklistForm8}
        list={listForm8}
        title="Cellular Base Station"
        type="Technical Install & Commission"
      />
    </View>
  );

  // Form 9 and 10
  pages.push(
    <View key="appendix-c-form9-10" wrap={false}>
      <AppendixCTable
        formNb="9"
        items={report.checklistForm9}
        list={listForm9}
        title="Microwave Radio"
        type="Technical Install & Commission"
      />
      <AppendixCTable
        formNb="10"
        items={report.checklistForm10}
        list={listForm10}
        title="AC/DC Power"
        type="Technical Install & Commission"
      />
    </View>
  );

  // Form 11
  pages.push(
    <View key="appendix-c-form11" wrap={false}>
      <AppendixCTable
        formNb="11"
        items={report.checklistForm11}
        list={listForm11}
        title="Miscellaneous Equipment"
        type="Technical Install & Commission"
      />
    </View>
  );

  return pages;
};

export default AppendixC;
