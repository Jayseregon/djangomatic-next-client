"use client";

import { Link } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Accordion, AccordionItem } from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import { saasData } from "@/config/saasData";
import { docsData } from "@/config/docsData";
import { videosData } from "@/config/videosData";

import { BlobProps } from "../admin/BlobStorage";

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

/**
 * Constructs a new href by combining the locale from the current path with the provided href.
 *
 * @param {string} currentPath - The current path of the application.
 * @param {string} href - The href to be appended.
 * @returns {string} The constructed href with the locale.
 */
const getAppHref = (currentPath: string, href: string): string => {
  return `/${currentPath.split("/")[1]}${href}`;
};

/**
 * Determines the styling for the link based on the current path.
 *
 * @param {string} currentPath - The current path of the application.
 * @param {string} href - The href of the link.
 * @returns {string} The CSS class for the link.
 */
const linkTagStyling = (currentPath: string, href: string): string =>
  `${currentPath === getAppHref(currentPath, href) ? "text-primary-700" : "text-primary-300 hover:text-secondary-500 focus:text-primary-700"} indent-3 `;

/**
 * SidebarSection component renders a list of categories and their items as a sidebar.
 * Each category has a title and a list of items with labels and href links.
 *
 * @param {SidebarSectionProps} props - The props for the SidebarSection component.
 * @param {Array} props.categories - An array of category objects, each containing a title and data array.
 * @param {string} [props.nonce] - An optional nonce for the Link component.
 * @returns {JSX.Element} The rendered SidebarSection component.
 */
const SidebarSection = ({
  categories,
  nonce,
}: SidebarSectionProps): JSX.Element => {
  const currentPath = usePathname();

  return (
    <>
      {categories.map((appCategory, categoryIndex) => (
        <React.Fragment key={categoryIndex}>
          {/* Render the category title */}
          <h3 className="text-md font-bold text-foreground indent-3 pt-3 pb-2">
            {appCategory.title}
          </h3>
          <ul>
            {appCategory.data.map((item, index) => (
              <li key={`${index}-${item.label}`} className="py-1">
                {/* Render the link for each item in the category */}
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

/**
 * SidebarVideosSection component renders a list of video categories as a sidebar.
 * Each category is linked to its respective video page.
 *
 * @returns {JSX.Element} The rendered SidebarVideosSection component.
 */
const SidebarVideosSection = (): JSX.Element => {
  const { category_labels } = videosData;
  const currentPath = usePathname();
  const [blobs, setBlobs] = useState<BlobProps[]>([]);

  // Fetch the list of blobs on component mount
  useEffect(() => {
    fetch("/api/azure-blob/list?subdir=videos_tutorials", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setBlobs(data);
      });
  }, []);

  /**
   * Filters categories based on the tags of the blobs.
   *
   * @returns {Array} An array of filtered categories.
   */
  const getCategories = (): Array<any> => {
    const categoriesInBlobs = blobs.map((blob) => blob.tags.categoryName);

    return category_labels.filter((category) =>
      categoriesInBlobs.includes(category.key),
    );
  };

  return (
    <div>
      {getCategories().map((category, categoryIndex) => (
        <React.Fragment key={categoryIndex}>
          <ul>
            <li className="py-1">
              {/* Render the link for each category */}
              <Link
                className={linkTagStyling(
                  currentPath,
                  `/docs/videos/${category.mapping.toLowerCase()}`,
                )}
                href={`/docs/videos/${category.mapping.toLowerCase()}`}
              >
                {category.mapping}
              </Link>
            </li>
          </ul>
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * SidebarSaas component renders a sidebar with categorized SaaS applications.
 * It uses an accordion to group applications by categories such as TDS, COGECO, Vistabeam, and Xplore.
 *
 * @param {SidebarProps} props - The props for the SidebarSaas component.
 * @param {string} [props.nonce] - An optional nonce for the Link component.
 * @returns {JSX.Element} The rendered SidebarSaas component.
 */
export const SidebarSaas: React.FC<SidebarProps> = ({ nonce }) => {
  const t = useTranslations("SaasSidebar");
  const currentPath = usePathname();
  const saasPath = siteConfig.navItems.filter(
    (item) => item.label === "Apps",
  )[0].href;

  /**
   * Extracts application data based on the provided property and type.
   *
   * @param {keyof typeof saasData} prop - The property of saasData to extract.
   * @param {string} type - The type of application to filter.
   * @returns {AppItem[]} The filtered application data.
   */
  const extractAppDataTds = (prop: keyof typeof saasData, type: string) =>
    (saasData[prop] as AppItem[]).filter((item) => item.type === type);

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
    titles.map((title) => ({
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

/**
 * SidebarDocs component renders a sidebar with categorized documentation sections.
 * It uses an accordion to group documentation by categories such as TDS, COGECO, Vistabeam, and Xplore.
 *
 * @param {SidebarProps} props - The props for the SidebarDocs component.
 * @param {string} [props.nonce] - An optional nonce for the Link component.
 * @returns {JSX.Element} The rendered SidebarDocs component.
 */
export const SidebarDocs: React.FC<SidebarProps> = ({ nonce }) => {
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
  const extractDocsData = (prop: keyof typeof docsData, isQGIS: boolean) =>
    docsData[prop].filter((item) => item.is_qgis_doc === isQGIS);

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
