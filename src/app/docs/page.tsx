import type { JSX } from "react";

import { useTranslations } from "next-intl";

import { title } from "@/components/primitives";
import DocsUsageGuidelines from "@/src/components/docs/DocsUsageGuidelines";

/**
 * DocsPage component renders a guide to help users navigate and utilize the documentation effectively.
 * It includes sections on understanding the documentation, permissions and access, maximizing benefits, and feedback contributions.
 *
 * Route Page Content and Purpose:
 * This route page provides a comprehensive guide to help users navigate and utilize the documentation effectively,
 * covering topics such as understanding the documentation, permissions and access, maximizing benefits, and providing feedback.
 *
 * @returns {JSX.Element} The rendered DocsPage component.
 */
export default function DocsPage(): JSX.Element {
  const t = useTranslations("Docs");

  return (
    <div className="text-center max-w-screen-md sm:px-5 mx-auto space-y-16">
      <div className="max-w-sm mx-auto">
        <h1 className={title()}>
          {t("title")} {t("subtitle")}
        </h1>
      </div>
      <DocsUsageGuidelines />
    </div>
  );
}
