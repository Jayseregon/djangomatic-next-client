"use client";
import type { JSX } from "react";

import { Spinner } from "@heroui/react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { videosData } from "@/src/config/videosData";
import { WithPermissionOverlayDocs } from "@/src/components/auth/withPermissionOverlay";
import { UserSchema } from "@/interfaces/lib";

import { title } from "../primitives";

import { VideosGridFiltered } from "./VideosGrids";

/**
 * VideoPageContent component renders the content of the video page.
 * It displays a loading spinner if the category is not available and
 * shows the videos grid with a permission overlay if the category is available.
 *
 * @param {Object} props - The props for the VideoPageContent component.
 * @param {any} props.session - The session object containing user information.
 * @returns {JSX.Element} The rendered VideoPageContent component.
 */
export const VideoPageContent = ({
  session,
}: {
  session: any;
}): JSX.Element => {
  const t = useTranslations("Docs");

  // Extract the category from the URL parameters
  const { category } = useParams();

  // Find the category data based on the category mapping
  const categoryData = videosData.category_labels.find(
    (item) => item.mapping.toLowerCase() === category,
  );

  // Extract permission, name mapping, and category key from the category data
  const permission = categoryData?.perms;
  const nameMapping = categoryData?.mapping;
  const categoryKey = categoryData?.key;

  // Display a loading spinner if the category is not available
  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center pt-16">
        <Spinner color="primary" label={t("videoPage.loading")} size="lg" />
      </div>
    );
  }

  return (
    <WithPermissionOverlayDocs
      email={session.user.email}
      permission={permission as keyof UserSchema}
    >
      <div>
        {/* Render the page title and subtitle */}
        <h1 className="grid grid-cols-1 gap-2">
          <span className={title()}>{nameMapping}</span>
          <span className={title({ size: "sm" })}>
            {t("videoPage.subtitle")}
          </span>
        </h1>

        <div className="py-3" />

        {/* Render the filtered videos grid based on the selected category */}
        <VideosGridFiltered selectedCategory={categoryKey as string} />
      </div>
    </WithPermissionOverlayDocs>
  );
};
