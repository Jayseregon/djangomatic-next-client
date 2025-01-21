import { useTranslations } from "next-intl";

import { ExclamationTriangleIcon } from "../icons";
import { subtitle } from "../primitives";

const AppsUsageGuidelines = () => {
  const t = useTranslations("AppsUsageGuidelines");

  return (
    <div className="text-justify">
      <p className={subtitle({ className: "text-foreground" })}>
        {t("guidanceParagraph")}
      </p>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">
          {t("sections.gettingStarted.title")}
        </h2>
        <p>{t("sections.gettingStarted.paragraph")}</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>
              {t("sections.gettingStarted.list.navigation.title")}:
            </strong>{" "}
            {t("sections.gettingStarted.list.navigation.description")}
          </li>
          <li>
            <strong>
              {t("sections.gettingStarted.list.examplesTutorials.title")}:
            </strong>{" "}
            {t("sections.gettingStarted.list.examplesTutorials.description")}
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">
          {t("sections.permissionsAccess.title")}
        </h2>
        <p className="flex inline-block gap-2">
          <ExclamationTriangleIcon data-testid="warning-icon" />
          {t("sections.permissionsAccess.paragraph1")}
        </p>
        <p>{t("sections.permissionsAccess.paragraph2")}</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>
              {t("sections.permissionsAccess.list.hintFunctionality.title")}:
            </strong>{" "}
            {t("sections.permissionsAccess.list.hintFunctionality.description")}
          </li>
          <li>
            <strong>
              {t("sections.permissionsAccess.list.ideaGeneration.title")}:
            </strong>{" "}
            {t("sections.permissionsAccess.list.ideaGeneration.description")}
          </li>
          <li>
            <strong>
              {t("sections.permissionsAccess.list.feedbackSuggestions.title")}:
            </strong>{" "}
            {t(
              "sections.permissionsAccess.list.feedbackSuggestions.description",
            )}
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">
          {t("sections.maximizingBenefits.title")}
        </h2>
        <p>{t("sections.maximizingBenefits.paragraph")}</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>
              {t("sections.maximizingBenefits.list.startBasics.title")}:
            </strong>{" "}
            {t("sections.maximizingBenefits.list.startBasics.description")}
          </li>
          <li>
            <strong>
              {t("sections.maximizingBenefits.list.utilizeIntegrations.title")}:
            </strong>{" "}
            {t(
              "sections.maximizingBenefits.list.utilizeIntegrations.description",
            )}
          </li>
          <li>
            <strong>
              {t("sections.maximizingBenefits.list.stayUpdated.title")}:
            </strong>{" "}
            {t("sections.maximizingBenefits.list.stayUpdated.description")}
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

export default AppsUsageGuidelines;
