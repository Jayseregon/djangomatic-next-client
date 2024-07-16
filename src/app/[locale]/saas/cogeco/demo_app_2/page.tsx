import { title, subtitle } from "@/components/primitives";
import { useTranslations } from "next-intl";

export default function SaasPage() {
  const t = useTranslations("SaasDemo2");

  return (
      <div>
        <h1 className={title()}>{t("h1_title")}</h1>
        <h2 className={subtitle({ class: "mt-4" })}>{t("subtitle")}</h2>

        <div className="py-20"></div>
      </div>
  );
}
