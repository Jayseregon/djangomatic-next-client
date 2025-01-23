"use client";

import { Link } from "@heroui/react";
import React, { useEffect, useState, useContext, type JSX } from "react";
import { usePathname } from "next/navigation";

import { NonceContext } from "@/src/app/providers";
import { videosData } from "@/config/videosData";
import { knowledgeHubData, SoftwareType } from "@/config/knowledgeCornerData";
import { SidebarSectionProps } from "@/interfaces/ui";
import { BlobProps } from "@/src/interfaces/admin";

/**
 * Constructs a new href by combining the locale from the current path with the provided href.
 *
 * @param {string} currentPath - The current path of the application.
 * @param {string} href - The href to be appended.
 * @returns {string} The constructed href with the locale.
 */
export const getAppHref = (currentPath: string, href: string): string => {
  return `/${currentPath.split("/")[1]}${href}`;
};

/**
 * Determines the styling for the link based on the current path.
 *
 * @param {string} currentPath - The current path of the application.
 * @param {string} href - The href of the link.
 * @returns {string} The CSS class for the link.
 */
export const linkTagStyling = (currentPath: string, href: string): string =>
  `${currentPath === getAppHref(currentPath, href) ? "text-primary-700" : "text-primary-300 hover:text-secondary-500 focus:text-primary-700"} indent-3 `;

/**
 * SidebarSection component renders a list of categories and their items as a sidebar.
 * Each category has a title and a list of items with labels and href links.
 *
 * @param {SidebarSectionProps} props - The props for the SidebarSection component.
 * @param {Array} props.categories - An array of category objects, each containing a title and data array.
 * @returns {JSX.Element} The rendered SidebarSection component.
 */
export const SidebarSection = ({
  categories,
}: SidebarSectionProps): JSX.Element => {
  const nonce = useContext(NonceContext);
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
export const SidebarVideosSection = (): JSX.Element => {
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
   * Filters and sorts categories based on the tags of the blobs.
   *
   * @returns {Array} An array of sorted categories.
   */
  const getCategories = (): Array<any> => {
    const categoriesInBlobs = blobs.map((blob) => blob.tags.categoryName);

    const filteredCategories = category_labels.filter((category) =>
      categoriesInBlobs.includes(category.key),
    );

    // Sort the filtered categories by 'mapping'
    filteredCategories.sort((a, b) => a.mapping.localeCompare(b.mapping));

    return filteredCategories;
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

export const SidebarSoftwareSection = (): JSX.Element => {
  const nonce = useContext(NonceContext);
  const currentPath = usePathname();
  const { software_docs } = knowledgeHubData;

  // Group docs by software type
  const groupedDocs = software_docs.reduce(
    (acc, doc) => {
      if (!acc[doc.software]) {
        acc[doc.software] = [];
      }
      acc[doc.software].push(doc);

      return acc;
    },
    {} as Record<SoftwareType, typeof software_docs>,
  );

  // Software type display names
  const softwareNames: Record<SoftwareType, string> = {
    qgis: "QGIS",
    autocad: "AutoCAD",
    autodesign: "AutoDesign",
  };

  return (
    <>
      {(Object.keys(groupedDocs) as SoftwareType[]).map((software) => (
        <React.Fragment key={software}>
          <h3 className="text-md font-bold text-foreground indent-3 pt-3 pb-2">
            {softwareNames[software]}
          </h3>
          <ul>
            {groupedDocs[software].map((item, index) => (
              <li key={`${index}-${item.label}`} className="py-1">
                <Link
                  className={linkTagStyling(currentPath, item.href)}
                  href={item.href}
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
