import type { JSX } from "react";

import { useTranslations } from "next-intl";

import { title } from "@/components/primitives";
import AppsUsageGuidelines from "@/src/components/saas/AppsUsageGuidelines";

/**
 * SaasPage component renders a guide to help users navigate and utilize web apps effectively.
 * It includes sections on getting started, permissions and access, maximizing benefits, and feedback contributions.
 *
 * Route Page Content and Purpose:
 * This route page provides a comprehensive guide to help users navigate and utilize the web apps effectively,
 * covering topics such as getting started, permissions and access, maximizing benefits, and providing feedback.
 *
 * @returns {JSX.Element} The rendered SaasPage component.
 */
export default function SaasPage(): JSX.Element {
  // Use the useTranslations hook to get the translation function for the "Saas" namespace
  const t = useTranslations("Saas");

  return (
    <div className="text-center max-w-screen-md sm:px-5 mx-auto space-y-16">
      <div className="max-w-sm mx-auto">
        <h1 className={title()}>
          {t("title")} {t("subtitle")}
        </h1>
      </div>
      <AppsUsageGuidelines />
    </div>
  );
}
