"use client";

import { Link } from "@nextui-org/react";
import React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Accordion, AccordionItem } from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import { saasData } from "@/config/saasData";
import { AppItem, SidebarProps, AppCategory } from "@/interfaces/ui";
import {
  linkTagStyling,
  SidebarSection,
} from "@/components/ui/sidebars/helper";

/**
 * SidebarSaas component renders a sidebar with categorized SaaS applications.
 * It uses an accordion to group applications by categories such as TDS, COGECO, Vistabeam, and Xplore.
 *
 * @param {SidebarProps} props - The props for the SidebarSaas component.
 * @param {string} [props.nonce] - An optional nonce for the Link component.
 * @returns {JSX.Element} The rendered SidebarSaas component.
 */
export const SidebarSaas: React.FC<SidebarProps> = ({
  nonce,
}: SidebarProps): JSX.Element => {
  const t = useTranslations("SaasSidebar");
  const currentPath = usePathname();
  const saasPath = siteConfig.navItemsBase.filter(
    (item) => item.label === "Apps",
  )[0].href;

  /**
   * Extracts application data based on the provided property and type.
   *
   * @param {keyof typeof saasData} prop - The property of saasData to extract.
   * @param {string} type - The type of application to filter.
   * @returns {AppItem[]} The filtered application data.
   */
  const extractAppDataTds = (
    prop: keyof typeof saasData,
    type: string,
  ): AppItem[] =>
    (saasData[prop] as AppItem[])
      .filter((item) => item.type === type)
      .sort((a, b) => a.label.localeCompare(b.label));

  /**
   * Gets application categories based on the provided data target and titles.
   *
   * @param {Object} params - The parameters for getting application categories.
   * @param {keyof typeof saasData} params.dataTarget - The data target property of saasData.
   * @param {string[]} params.titles - The titles of the categories.
   * @returns {AppCategory[]} The application categories.
   */
  const getAppCategories = ({
    dataTarget,
    titles,
  }: {
    dataTarget: keyof typeof saasData;
    titles: string[];
  }): AppCategory[] =>
    titles
      .sort((a, b) => a.localeCompare(b))
      .map((title) => ({
        title: title.toUpperCase(),
        data: extractAppDataTds(dataTarget, title.toLowerCase()),
      }));

  // Extract TDS apps data
  const appCategoriesTDS = getAppCategories({
    dataTarget: "tds_saas",
    titles: ["hld", "lld", "arcgis", "override", "admin", "super"],
  });

  // Extract COGECO apps data
  const appCategoriesCOGECO = getAppCategories({
    dataTarget: "cogeco_saas",
    titles: ["hld"],
  });

  // Extract Vistabeam apps data
  const appCategoriesVistabeam = getAppCategories({
    dataTarget: "vistabeam_saas",
    titles: ["hld", "override", "super"],
  });

  // Extract Xplore apps data
  const appCategoriesXplore = getAppCategories({
    dataTarget: "xplore_saas",
    titles: ["admin"],
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="section">
        <Accordion defaultExpandedKeys={["Guide"]} variant="bordered">
          {/* Guide Section */}
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

          {/* COGECO Section */}
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

          {/* TDS Section */}
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

          {/* Vistabeam Section */}
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

          {/* Xplore Section */}
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
