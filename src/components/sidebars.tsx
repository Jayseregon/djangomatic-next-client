"use client";

import { Link } from "@nextui-org/react";
import React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Accordion, AccordionItem } from "@nextui-org/react";

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
  type?: string;
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
// const liTagStyling = (currentPath: string, href: string) =>
//   `border-l ${currentPath === getAppHref(currentPath, href) ? "border-slate-300" : "hover:border-slate-900 dark:border-slate-700 dark:hover:border-slate-100"}`;
const linkTagStyling = (currentPath: string, href: string) =>
  `indent-3 ${currentPath === getAppHref(currentPath, href) ? "text-primary-700" : "text-primary-300 hover:text-secondary-500 focus:text-primary-700"}`;

// define the SidebarSection component
const SidebarSection = ({ categories, nonce }: SidebarSectionProps) => {
  const currentPath = usePathname();

  return (
    <>
      {categories.map((appCategory, categoryIndex) => (
        <React.Fragment key={categoryIndex}>
          <h3 className="text-md font-bold text-foreground indent-3 pt-3 pb-2">
            {appCategory.title}
          </h3>
          <ul>
            {appCategory.data.map((item, index) => (
              <li key={`${index}-${item.label}`} className="py-1">
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
    (item) => item.label === "Apps",
  )[0].href;

  const extractAppDataTds = (prop: keyof typeof saasData, type: string) =>
    (saasData[prop] as AppItem[]).filter((item) => item.type === type);

  const getAppCategories = ({
    dataTarget,
    titles,
  }: {
    dataTarget: keyof typeof saasData;
    titles: string[];
  }): AppCategory[] =>
    titles.map((title) => ({
      title: title.toUpperCase(),
      data: extractAppDataTds(dataTarget, title.toLowerCase()),
    }));

  // extract TDS apps data
  const appCategoriesTDS = getAppCategories({
    dataTarget: "tds_saas",
    titles: ["hld", "lld", "arcgis", "override", "admin", "super"],
  });

  // extract COGECO apps data
  const appCategoriesCOGECO = getAppCategories({
    dataTarget: "cogeco_saas",
    titles: ["hld"],
  });

  // extract Vistabeam apps data
  const appCategoriesVistabeam = getAppCategories({
    dataTarget: "vistabeam_saas",
    titles: ["hld", "override", "super"],
  });

  // extract TDS apps data
  const appCategoriesXplore = getAppCategories({
    dataTarget: "xplore_saas",
    titles: ["admin"],
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="section">
        <Accordion defaultExpandedKeys={["Guide"]} variant="bordered">
          <AccordionItem
            key="Guide"
            aria-label="Guide"
            title={
              <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                Guide
              </h2>
            }
          >
            <Link
              className={`${linkTagStyling(currentPath, saasPath)}`}
              href={saasPath}
              nonce={nonce}
            >
              {t("link_title")}
            </Link>
          </AccordionItem>

          <AccordionItem
            key="TDS"
            aria-label="TDS"
            title={
              <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                TDS
              </h2>
            }
          >
            <SidebarSection categories={appCategoriesTDS} nonce={nonce} />
          </AccordionItem>

          <AccordionItem
            key="COGECO"
            aria-label="COGECO"
            title={
              <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                COGECO
              </h2>
            }
          >
            <SidebarSection categories={appCategoriesCOGECO} nonce={nonce} />
          </AccordionItem>

          <AccordionItem
            key="Vistabeam"
            aria-label="Vistabeam"
            title={
              <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                Vistabeam
              </h2>
            }
          >
            <SidebarSection categories={appCategoriesVistabeam} nonce={nonce} />
          </AccordionItem>

          <AccordionItem
            key="Xplore"
            aria-label="Xplore"
            title={
              <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                Xplore
              </h2>
            }
          >
            <SidebarSection categories={appCategoriesXplore} nonce={nonce} />
          </AccordionItem>
        </Accordion>
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

  const extractDocsData = (prop: keyof typeof docsData, isQGIS: boolean) =>
    docsData[prop].filter((item) => item.is_qgis_doc === isQGIS);

  const getDocsCategories = ({
    docDataTarget,
  }: {
    docDataTarget: keyof typeof docsData;
  }): AppCategory[] => [
    {
      title: "Web Tools",
      data: extractDocsData(docDataTarget, false),
    },
    {
      title: "QGIS Tools",
      data: extractDocsData(docDataTarget, true),
    },
  ];

  return (
    <div className="flex flex-col gap-2 ">
      <div className="section">
        <Accordion defaultExpandedKeys={["Guide"]} variant="bordered">
          <AccordionItem
            key="Guide"
            aria-label="Guide"
            title={
              <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                Guide
              </h2>
            }
          >
            <Link
              className={`${linkTagStyling(currentPath, docsPath)}`}
              href={docsPath}
              nonce={nonce}
            >
              {t("link_title")}
            </Link>
          </AccordionItem>

          <AccordionItem
            key="TDS"
            aria-label="TDS"
            title={
              <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                TDS
              </h2>
            }
          >
            <SidebarSection
              categories={getDocsCategories({ docDataTarget: "tds_docs" })}
              nonce={nonce}
            />
          </AccordionItem>

          <AccordionItem
            key="COGECO"
            aria-label="COGECO"
            title={
              <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                COGECO
              </h2>
            }
          >
            <SidebarSection
              categories={getDocsCategories({ docDataTarget: "cogeco_docs" })}
              nonce={nonce}
            />
          </AccordionItem>

          <AccordionItem
            key="Vistabeam"
            aria-label="Vistabeam"
            title={
              <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                Vistabeam
              </h2>
            }
          >
            <SidebarSection
              categories={getDocsCategories({
                docDataTarget: "vistabeam_docs",
              })}
              nonce={nonce}
            />
          </AccordionItem>

          <AccordionItem
            key="Xplore"
            aria-label="Xplore"
            title={
              <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                Xplore
              </h2>
            }
          >
            <SidebarSection
              categories={getDocsCategories({ docDataTarget: "xplore_docs" })}
              nonce={nonce}
            />
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
