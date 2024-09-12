export type VideosData = typeof videosData;

export const videosData = {
  category_labels: [
    {
      key: "default",
      label: "default",
      mapping: "Default",
      perms: "canAccessVideoDefault",
    },
    {
      key: "qgis",
      label: "qgis",
      mapping: "QGIS",
      perms: "canAccessVideoQGIS",
    },
    {
      key: "sttar",
      label: "sttar",
      mapping: "AutoDesign",
      perms: "canAccessVideoSttar",
    },
  ],
  client_labels: [
    { key: "tds", label: "tds" },
    { key: "cogeco", label: "cogeco" },
    { key: "vistabeam", label: "vistabeam" },
    { key: "xplore", label: "xplore" },
    { key: "other", label: "other" },
  ],
};
