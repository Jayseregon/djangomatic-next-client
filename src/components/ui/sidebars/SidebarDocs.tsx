"use client";

import { Link } from "@nextui-org/react";
import React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Accordion, AccordionItem } from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import { docsData } from "@/config/docsData";
import { AppItem, SidebarProps, AppCategory } from "@/interfaces/ui";
import {
  linkTagStyling,
  SidebarSection,
  SidebarVideosSection,
} from "@/components/ui/sidebars/helper";

/**
 * SidebarDocs component renders a sidebar with categorized documentation sections.
 * It uses an accordion to group documentation by categories such as TDS, COGECO, Vistabeam, and Xplore.
 *
 * @param {SidebarProps} props - The props for the SidebarDocs component.
 * @param {string} [props.nonce] - An optional nonce for the Link component.
 * @returns {JSX.Element} The rendered SidebarDocs component.
 */
export const SidebarDocs: React.FC<SidebarProps> = ({
  nonce,
}: SidebarProps): JSX.Element => {
  const t = useTranslations("SaasSidebar");
  const currentPath = usePathname();
  const docsPath = siteConfig.navItems.filter(
    (item) => item.label === "Docs",
  )[0].href;

  /**
   * Extracts documentation data based on the provided property and QGIS flag.
   *
   * @param {keyof typeof docsData} prop - The property of docsData to extract.
   * @param {boolean} isQGIS - Flag to filter QGIS documentation.
   * @returns {AppItem[]} The filtered documentation data.
   */
  const extractDocsData = (
    prop: keyof typeof docsData,
    isQGIS: boolean,
  ): AppItem[] =>
    docsData[prop]
      .filter((item) => item.is_qgis_doc === isQGIS)
      .sort((a, b) => a.label.localeCompare(b.label));

  /**
   * Gets documentation categories based on the provided data target.
   *
   * @param {Object} params - The parameters for getting documentation categories.
   * @param {keyof typeof docsData} params.docDataTarget - The data target property of docsData.
   * @returns {AppCategory[]} The documentation categories.
   */
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
              className={`${linkTagStyling(currentPath, docsPath)}`}
              href={docsPath}
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
            <SidebarSection
              categories={getDocsCategories({ docDataTarget: "cogeco_docs" })}
              nonce={nonce}
            />
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
            <SidebarSection
              categories={getDocsCategories({ docDataTarget: "tds_docs" })}
              nonce={nonce}
            />
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
            <SidebarSection
              categories={getDocsCategories({
                docDataTarget: "vistabeam_docs",
              })}
              nonce={nonce}
            />
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
            <SidebarSection
              categories={getDocsCategories({ docDataTarget: "xplore_docs" })}
              nonce={nonce}
            />
          </AccordionItem>

          {/* Videos Section */}
          <AccordionItem
            key="videos"
            aria-label="videos"
            title={
              <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                Videos
              </h2>
            }
          >
            <SidebarVideosSection />
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
