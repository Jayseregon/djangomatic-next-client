import { useTranslations } from "next-intl";
import { Snippet } from "@nextui-org/snippet";
import { headers } from "next/headers";

import { ServerSchemaAndTableSelector } from "@/components/serverDropdowns";
import { title, subtitle } from "@/components/primitives";

export default function SaasPage() {
  const t = useTranslations("HP_by_Splits1");
  const nonce = headers().get("x-nonce");

  return (
    <div>
      <h1 className={title()}>{t("h1_title")}</h1>
      <h2 className={subtitle({ class: "mt-4" })}>{t("subtitle")}</h2>

      <div className="py-3">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <span>{t("code")}</span>
        </Snippet>
      </div>

      <div className="py-3" />

      <ServerSchemaAndTableSelector nonce={nonce || undefined} />
    </div>
  );
}
