import { title } from "@/components/primitives";
import { useTranslations } from "next-intl";

export default function RnDPage() {
  const t = useTranslations("Index");

  return (
    <div>
      <h1 className={title()}>R&D</h1>
      <h2>{t("title")}</h2>
    </div>
  );
}
