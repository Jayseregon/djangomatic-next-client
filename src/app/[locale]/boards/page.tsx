import { title } from "@/components/primitives";
import { useTranslations } from "next-intl";

export default function BoardsPage() {
  const t = useTranslations("Index");

  return (
    <div>
      <h1 className={title()}>Boards</h1>
      <h2>{t("title")}</h2>
    </div>
  );
}
