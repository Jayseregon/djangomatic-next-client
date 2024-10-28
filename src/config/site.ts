export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Djangomatic Pro",
  name_beta: "Djangomatic Pro [beta]",
  name_staging: "Djangomatic Pro [staging]",
  name_local: "Djangomatic Pro [local]",
  hero_descr: "Simplifying your Daily Tasks.",
  description: "Process Automation on the Cloud.",
  icon: "/favicon.ico",
  navItems: [
    {
      label: "Apps",
      href: "/saas",
    },
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Reports",
      href: "/reports",
    },
    {
      label: "Boards",
      href: "/boards",
    },
    {
      label: "R&D",
      href: "/rnd",
    },
    {
      label: "Admin",
      href: "/admin",
    },
  ],
};
