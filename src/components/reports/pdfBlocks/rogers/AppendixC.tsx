import { View } from "@react-pdf/renderer";

import listForm4 from "public/reports/rogers/listform4.json";
import listForm5 from "public/reports/rogers/listform5.json";
import listForm6 from "public/reports/rogers/listform6.json";
import listForm7 from "public/reports/rogers/listform7.json";
import listForm8 from "public/reports/rogers/listform8.json";
import listForm9 from "public/reports/rogers/listform9.json";
import listForm10 from "public/reports/rogers/listform10.json";
import listForm11 from "public/reports/rogers/listform11.json";
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
  return (
    <>
      <View break style={StylesPDF.sectionTitleContainer}>
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
      {/* New page */}
      <View>
        <AppendixCTable
          formNb="4"
          items={report.checklistForm4}
          list={listForm4}
          title="Antenna Structure and Site Works"
          type="Civil"
        />
      </View>
      {/* New page */}
      <View break>
        <AppendixCTable
          formNb="5"
          items={report.checklistForm5}
          list={listForm5}
          title="Electrical/Mechanical Alarm & Fire Protection Systems"
          type="Civil"
        />
      </View>
      {/* 2 in 1 page */}
      <View break>
        <AppendixCTable
          formNb="6"
          items={report.checklistForm6}
          list={listForm6}
          title="AC Power and Grounding"
          type="Civil"
        />
      </View>
      <View style={{ paddingTop: 20 }}>
        <AppendixCTable
          formNb="7"
          items={report.checklistForm7}
          list={listForm7}
          title="Cable Tray and Overhead Support"
          type="Civil"
        />
      </View>
      {/* 2 in 1 page */}
      <View break>
        <AppendixCTable
          formNb="8"
          items={report.checklistForm8}
          list={listForm8}
          title="Cellular Base Station"
          type="Technical Install & Commission"
        />
      </View>
      <View style={{ paddingTop: 20 }}>
        <AppendixCTable
          formNb="9"
          items={report.checklistForm9}
          list={listForm9}
          title="Microwave Radio"
          type="Technical Install & Commission"
        />
      </View>
      {/* 2 in 1 page */}
      <View break>
        <AppendixCTable
          formNb="10"
          items={report.checklistForm10}
          list={listForm10}
          title="AC/DC Power"
          type="Technical Install & Commission"
        />
      </View>
      <View style={{ paddingTop: 20 }}>
        <AppendixCTable
          formNb="11"
          items={report.checklistForm11}
          list={listForm11}
          title="Miscellaneous Equipment"
          type="Technical Install & Commission"
        />
      </View>
    </>
  );
};

export default AppendixC;
