import { title, subtitle } from "@/components/primitives";
import { useTranslations } from "next-intl";

export default function BoardsPage() {
  const t = useTranslations("Boards");

  return (
    <div>
      <h1 className={title()}>{t("h1_title")}</h1>
      <h2 className={subtitle({ class: "mt-4" })}>{t("subtitle")}</h2>
    </div>
  );
}
