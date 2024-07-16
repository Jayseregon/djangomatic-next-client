"use client";

import { Link } from "@nextui-org/link";
import React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { saasData } from "@/config/saasData";
import { docsData } from "@/config/docsData";

// define the types for the Sidebar component
interface SidebarProps {
  nonce?: string;
}
// define the types for the apps data arrays
interface AppItem {
  label: string;
  href: string;
}
interface AppCategory {
  title: string;
  data: AppItem[];
}
// define the types for the SidebarSection component
interface SidebarSectionProps {
  categories: AppCategory[];
  nonce?: string;
}

// get the locale from the router
const getAppHref = (currentPath: string, href: string) =>
  `/${currentPath.split("/")[1]}${href}`;
// define default styling for the list item and link
const liTagStyling = (currentPath: string, href: string) =>
  `border-l ${currentPath === getAppHref(currentPath, href) ? "border-slate-300" : "hover:border-slate-900 dark:border-slate-700 dark:hover:border-slate-100"}`;
const linkTagStyling = (currentPath: string, href: string) =>
  `indent-6 ${currentPath === getAppHref(currentPath, href) ? "text-primary-700" : "text-primary-300 hover:text-secondary-500 focus:text-primary-700"}`;

// define the SidebarSection component
const SidebarSection: React.FC<SidebarSectionProps> = ({
  categories,
  nonce,
}) => {
  const currentPath = usePathname();

  return (
    <>
      {categories.map((appCategory, categoryIndex) => (
        <React.Fragment key={categoryIndex}>
          <h3 className="text-md font-bold text-foreground indent-6 pt-3 pb-2">
            {appCategory.title}
          </h3>
          <ul>
            {appCategory.data.map((item, index) => (
              <li
                key={`${index}-${item.label}`}
                className={`py-1 ${liTagStyling(currentPath, item.href)}`}
              >
                <Link
                  className={linkTagStyling(currentPath, item.href)}
                  href={item.href || "#"}
                  nonce={nonce}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </>
  );
};

export const SidebarSaas: React.FC<SidebarProps> = ({ nonce }) => {
  const t = useTranslations("SaasSidebar");
  const currentPath = usePathname();
  const saasPath = siteConfig.navItems.filter(
    (item) => item.label === "Saas",
  )[0].href;

  const extractAppDataTds = (type: string) =>
    saasData.tds_saas.filter((item) => item.type === type);

  // extract TDS apps data
  const hldAppsTds: AppCategory = {
    title: "HLD",
    data: extractAppDataTds("hld"),
  };
  const lldAppsTds: AppCategory = {
    title: "LLD",
    data: extractAppDataTds("lld"),
  };
  const arcgisAppsTds: AppCategory = {
    title: "ArcGIS",
    data: extractAppDataTds("arcgis"),
  };
  const overrideAppsTds: AppCategory = {
    title: "Override",
    data: extractAppDataTds("override"),
  };
  const adminAppsTds: AppCategory = {
    title: "Admin",
    data: extractAppDataTds("admin"),
  };
  const superAppsTds: AppCategory = {
    title: "Super",
    data: extractAppDataTds("super"),
  };

  // extract COGECO apps data
  const cogecoApps: AppCategory = {
    title: "HLD",
    data: saasData.cogeco_saas.filter(() => true),
  };

  // extract Vistabeam apps data
  const hldAppsVb: AppCategory = {
    title: "HLD",
    data: saasData.vistabeam_saas.filter((item) => item.type === "hld"),
  };
  const overrideAppsVb: AppCategory = {
    title: "Override",
    data: saasData.vistabeam_saas.filter((item) => item.type === "override"),
  };
  const superAppsVb: AppCategory = {
    title: "Super",
    data: saasData.vistabeam_saas.filter((item) => item.type === "super"),
  };

  return (
    <div className="flex flex-col gap-2 ">
      <div className="section">
        <ul>
          <h2 className="text-xl font-black text-foreground indent-2 mb-3">
            TDS
          </h2>

          <Link
            className={`${liTagStyling(currentPath, saasPath)} ${linkTagStyling(currentPath, saasPath)}`}
            href={saasPath}
            nonce={nonce}
          >
            {t("link_title")}
          </Link>

          <SidebarSection
            categories={[
              hldAppsTds,
              lldAppsTds,
              arcgisAppsTds,
              overrideAppsTds,
              adminAppsTds,
              superAppsTds,
            ]}
            nonce={nonce}
          />

          <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
            COGECO
          </h2>

          <SidebarSection categories={[cogecoApps]} nonce={nonce} />

          <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
            Vistabeam
          </h2>

          <SidebarSection
            categories={[hldAppsVb, overrideAppsVb, superAppsVb]}
            nonce={nonce}
          />
        </ul>
      </div>
    </div>
  );
};

export const SidebarDocs: React.FC<SidebarProps> = ({ nonce }) => {
  const t = useTranslations("SaasSidebar");
  const currentPath = usePathname();
  const docsPath = siteConfig.navItems.filter(
    (item) => item.label === "Docs",
  )[0].href;

  const extractDocsDataTds = (isQGIS: boolean) =>
    docsData.tds_docs.filter((item) => item.is_qgis_doc === isQGIS);

  const webTools: AppCategory = {
    title: "Web Tools",
    data: extractDocsDataTds(false),
  };

  const qgisTools: AppCategory = {
    title: "QGIS Tools",
    data: extractDocsDataTds(true),
  };

  return (
    <div className="flex flex-col gap-2 ">
      <div className="section">
        <ul>
          <h2 className="text-xl font-black text-foreground indent-2 mb-3">
            TDS
          </h2>

          <Link
            className={`${liTagStyling(currentPath, docsPath)} ${linkTagStyling(currentPath, docsPath)}`}
            href={docsPath}
            nonce={nonce}
          >
            {t("link_title")}
          </Link>

          <SidebarSection categories={[webTools, qgisTools]} nonce={nonce} />
        </ul>
      </div>
    </div>
  );
};
