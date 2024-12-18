"use client";
import type { JSX } from "react";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { title } from "@/components/primitives";
import { saasData } from "@/src/config/saasData";
import { AppItem } from "@/interfaces/ui";

interface PillVersioningProps {
  version: string | undefined;
  dateUpdated: string | undefined;
  updateDescription?: string | undefined;
}

/**
 * AppPageDescription component automatically detects and displays the app description, version, and update date.
 *
 * @param {Object} props - The props for the AppPageDescription component.
 * @param {keyof typeof saasData} props.client - The client key to access the saasData.
 * @returns {JSX.Element} The rendered AppPageDescription component.
 */
export const AppPageDescription = ({
  client,
  targetTranslation = "tdsApps",
}: {
  client: keyof typeof saasData;
  targetTranslation?: string;
}): JSX.Element => {
  const t = useTranslations(targetTranslation);
  const currentPath = usePathname();
  // Find the app data based on the current path
  const appData = (saasData[client] as AppItem[]).find(
    (app) => app.href === currentPath,
  );
  const appDesc = appData?.desc;
  const appVersion = appData?.version;
  const appDateUpdated = appData?.date_upd;

  return (
    <div className="grid grid-cols-1 gap-5 pb-10">
      {/* Display the version and last updated date */}
      <PillVersioning dateUpdated={appDateUpdated} version={appVersion} />
      <div className="text-wrap break-all max-w-2xl mx-auto">
        {/* Display the app description */}
        <h2 className={title({ size: "xs" })}>{t(`${appDesc}.description`)}</h2>
      </div>
    </div>
  );
};

/**
 * PillVersioning component displays the version and last updated date of the app.
 *
 * @param {PillVersioningProps} props - The props for the PillVersioning component.
 * @param {string | undefined} props.version - The version of the app.
 * @param {string | undefined} props.dateUpdated - The last updated date of the app.
 * @param {string | undefined} [props.updateDescription] - The update description of the app (optional).
 * @returns {JSX.Element} The rendered PillVersioning component.
 */
export const PillVersioning = ({
  version,
  dateUpdated,
}: PillVersioningProps) => {
  return (
    <div className="flex place-items-center font-mono mx-auto space-x-5">
      <div className="flex items-center justify-center">
        <span className="text-xs font-semibold text-background border-2 border-emerald-400 bg-emerald-400 rounded-l-2xl ps-3 pe-2 py-1">
          Version
        </span>
        <span className="text-xs font-semibold text-foreground border-2 border-emerald-400 rounded-r-2xl ps-2 pe-3 py-1">
          {version}
        </span>
      </div>

      <div className="flex items-center justify-center">
        <span className="text-xs font-semibold text-background border-2 border-pink-400 bg-pink-400 rounded-l-2xl ps-3 pe-2 py-1">
          Last Updated
        </span>
        <span className="text-xs font-semibold text-foreground border-2 border-pink-400 rounded-r-2xl ps-2 pe-3 py-1">
          {dateUpdated}
        </span>
      </div>
    </div>
  );
};
