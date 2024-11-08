import { useTranslations } from "next-intl";

import { ExclamationTriangleIcon } from "../icons";
import { subtitle } from "../primitives";

const DocsUsageGuidelines = () => {
  const t = useTranslations("DocsUsageGuidelines");

  return (
    <div className="text-justify">
      <p className={subtitle({ className: "text-foreground" })}>
        {t("guidanceParagraph")}
      </p>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">
          {t("sections.understandingDocumentation.title")}
        </h2>
        <p>{t("sections.understandingDocumentation.paragraph")}</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>
              {t(
                "sections.understandingDocumentation.list.searchFunctionality.title",
              )}
              :
            </strong>{" "}
            {t(
              "sections.understandingDocumentation.list.searchFunctionality.description",
            )}
          </li>
          <li>
            <strong>
              {t("sections.understandingDocumentation.list.navigation.title")}:
            </strong>{" "}
            {t(
              "sections.understandingDocumentation.list.navigation.description",
            )}
          </li>
          <li>
            <strong>
              {t(
                "sections.understandingDocumentation.list.examplesTutorials.title",
              )}
              :
            </strong>{" "}
            {t(
              "sections.understandingDocumentation.list.examplesTutorials.description",
            )}
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">
          {t("sections.permissionsAccess.title")}
        </h2>
        <p className="flex inline-block gap-2">
          <ExclamationTriangleIcon />
          {t("sections.permissionsAccess.paragraph1")}
        </p>
        <p>{t("sections.permissionsAccess.paragraph2")}</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>
              {t("sections.permissionsAccess.list.confidentiality.title")}:
            </strong>{" "}
            {t("sections.permissionsAccess.list.confidentiality.description")}
          </li>
          <li>
            <strong>
              {t("sections.permissionsAccess.list.controlledAccess.title")}:
            </strong>{" "}
            {t("sections.permissionsAccess.list.controlledAccess.description")}
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">
          {t("sections.gettingMostOutTools.title")}
        </h2>
        <p>{t("sections.gettingMostOutTools.paragraph")}</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>
              {t("sections.gettingMostOutTools.list.startBasics.title")}:
            </strong>{" "}
            {t("sections.gettingMostOutTools.list.startBasics.description")}
          </li>
          <li>
            <strong>
              {t("sections.gettingMostOutTools.list.exploreAdvanced.title")}:
            </strong>{" "}
            {t("sections.gettingMostOutTools.list.exploreAdvanced.description")}
          </li>
          <li>
            <strong>
              {t("sections.gettingMostOutTools.list.useSupport.title")}:
            </strong>{" "}
            {t("sections.gettingMostOutTools.list.useSupport.description")}
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">
          {t("sections.feedbackContributions.title")}
        </h2>
        <p>{t("sections.feedbackContributions.paragraph1")}</p>
        <p>{t("sections.feedbackContributions.paragraph2")}</p>
      </section>
    </div>
  );
};

export default DocsUsageGuidelines;
