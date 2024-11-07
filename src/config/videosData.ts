export type VideosData = typeof videosData;

export const videosData = {
  category_labels: [
    {
      key: "admin",
      label: "admin",
      mapping: "Admin",
      perms: "canAccessVideoAdmin",
    },
    {
      key: "gis",
      label: "gis",
      mapping: "GIS",
      perms: "canAccessVideoGIS",
    },
    {
      key: "autocad",
      label: "autocad",
      mapping: "AutoCAD",
      perms: "canAccessVideoCAD",
    },
    {
      key: "lidar",
      label: "lidar",
      mapping: "LiDAR",
      perms: "canAccessVideoLiDAR",
    },
    {
      key: "engineering",
      label: "engineering",
      mapping: "Engineering",
      perms: "canAccessVideoEng",
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
