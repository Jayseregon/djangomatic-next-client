export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Djangomatic Pro",
  name_staging: "Djangomatic Pro [staging]",
  name_local: "Djangomatic Pro [local]",
  hero_descr: "Simplifying your Daily Tasks.",
  description: "Process Automation on the Cloud.",
  icon: "/favicon.ico",
  navItemsBase: [
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
  ],
  navItemsAdmin: [
    {
      label: "R&D",
      href: "/rnd",
    },
    {
      label: "Admin",
      href: "/admin",
    },
  ],
  navItemsAI: [
    {
      label: "✨ Chatbot 🤖",
      href: "/chatbot",
    },
  ],
  boardsNavItems: [
    {
      label: "Roadmap",
      target: "roadmap",
      href: "/boards/roadmap",
    },
    {
      label: "Bug Report",
      target: "bugReport",
      href: "/boards/bug-report",
    },
  ],
};
