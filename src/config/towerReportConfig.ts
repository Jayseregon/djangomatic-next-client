import listForm4 from "public/reports/rogers/listForm4.json";
import listForm5 from "public/reports/rogers/listForm5.json";
import listForm6 from "public/reports/rogers/listForm6.json";
import listForm7 from "public/reports/rogers/listForm7.json";
import listForm8 from "public/reports/rogers/listForm8.json";
import listForm9 from "public/reports/rogers/listForm9.json";
import listForm10 from "public/reports/rogers/listForm10.json";
import listForm11 from "public/reports/rogers/listForm11.json";

export const WORK_ORDER_MIN_LENGTH = 6;

type ChecklistFormKey =
  | "checklistForm4"
  | "checklistForm5"
  | "checklistForm6"
  | "checklistForm7"
  | "checklistForm8"
  | "checklistForm9"
  | "checklistForm10"
  | "checklistForm11";

// Define form configurations
export const formConfigs = [
  {
    key: "form4",
    formKey: "checklistForm4" as ChecklistFormKey,
    title: "FORM 4: Civil - Antenna Structure and Site Works",
    list: listForm4,
  },
  {
    key: "form5",
    formKey: "checklistForm5" as ChecklistFormKey,
    title:
      "FORM 5: Civil - Electrical/Mechanical Alarm & Fire Protection Systems",
    list: listForm5,
  },
  {
    key: "form6",
    formKey: "checklistForm6" as ChecklistFormKey,
    title: "FORM 6: Civil - AC Power and Grounding",
    list: listForm6,
  },
  {
    key: "form7",
    formKey: "checklistForm7" as ChecklistFormKey,
    title: "FORM 7: Civil - Cable Tray and Overhead Support",
    list: listForm7,
  },
  {
    key: "form8",
    formKey: "checklistForm8" as ChecklistFormKey,
    title: "FORM 8: Technical Install & Commission - Cellular Base Station",
    list: listForm8,
  },
  {
    key: "form9",
    formKey: "checklistForm9" as ChecklistFormKey,
    title: "FORM 9: Technical Install & Commission - Microwave Radio",
    list: listForm9,
  },
  {
    key: "form10",
    formKey: "checklistForm10" as ChecklistFormKey,
    title: "FORM 10: Technical Install & Commission - AC/DC Power",
    list: listForm10,
  },
  {
    key: "form11",
    formKey: "checklistForm11" as ChecklistFormKey,
    title: "FORM 11: Technical Install & Commission - Miscellaneous Equipment",
    list: listForm11,
  },
];

export const quickbaseMapping = {
  jde_job: "1141",
  site_name: "1114",
  site_code: "1113",
  site_region: "1195",
  tower_id: "1115",
  tower_name: "1149",
  tower_site_name: "1116",
  job_revision: "1132",
  job_description: "1134",
  design_standard: "1135",
  client_company: "1137",
  client_name: "1117",
  assigned_peng: "1048",
} as const;
