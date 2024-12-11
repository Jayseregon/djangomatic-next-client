export type DocsData = typeof knowledgeHubData;

export type SoftwareType = "qgis" | "autocad" | "autodesign";

export interface SoftwareDoc {
  label: string;
  href: string;
  software: SoftwareType;
}

export const knowledgeHubData = {
  software_docs: [
    {
      label: "QGIS Placeholder",
      href: "/docs/knowledge-corner/qgis/kc-qgis-placeholder",
      software: "qgis",
    },
    {
      label: "AutoCAD Placeholder",
      href: "/docs/knowledge-corner/autocad/kc-autocad-placeholder",
      software: "autocad",
    },
    {
      label: "AutoDesign Placeholder",
      href: "/docs/knowledge-corner/autodesign/kc-autodesign-placeholder",
      software: "autodesign",
    },
  ] as SoftwareDoc[],
};
