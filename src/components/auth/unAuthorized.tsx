"use client";
import type { JSX } from "react";

import { useTranslations } from "next-intl";

import { StopSignIcon } from "@/components/icons";

/**
 * UnAuthorized component displays an unauthorized access message with an icon.
 *
 * @returns {JSX.Element} The rendered UnAuthorized component.
 */
export const UnAuthorized = (): JSX.Element => {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center gap-5 mt-10">
      {/* Display a stop sign icon */}
      <div className="text-danger">
        <StopSignIcon size={100} />
      </div>

      {/* Display an unauthorized access message */}
      <div className="text-2xl p-2 bg-danger/50 text-danger-700 rounded-xl">
        {t("UnAuthorized.access")}
      </div>
    </div>
  );
};
