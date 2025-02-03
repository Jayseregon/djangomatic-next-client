import { useTranslations } from "next-intl";
import { Snippet } from "@heroui/snippet";
import Link from "next/link";
import { Bug, SquareArrowOutUpRight } from "lucide-react";

export const BugReportNotice = () => {
  const t = useTranslations("HomePage");

  return (
    <Snippet hideCopyButton hideSymbol variant="flat">
      <div className="inline-flex space-x-2 items-center">
        <Bug color="#dc2626" />
        <p className="text-center pt-1 text-red-800 dark:text-red-300 flex items-center">
          {t("BugReport")}
        </p>
        <Link className="flex items-center" href="/boards/bug-report">
          <SquareArrowOutUpRight color="#dc2626" />
        </Link>
      </div>
    </Snippet>
  );
};
