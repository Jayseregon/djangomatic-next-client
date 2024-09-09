import { useTranslations } from "next-intl";
import { Snippet } from "@nextui-org/snippet";
import { headers } from "next/headers";

import { UnAuthenticated } from "@/components/unAuthenticated";
import { auth } from "@/auth";
import { ServerSchemaAndTableSelector } from "@/components/serverDropdowns";
import { title, subtitle } from "@/components/primitives";
import { WithPermissionOverlay } from "@/src/components/withPermissionOverlay";

export default async function SaasPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <SaasPageContent session={session} />;
}

function SaasPageContent({ session }: { session: any }) {
  const t = useTranslations("HP_by_Splits1");
  const nonce = headers().get("x-nonce");

  return (
    <WithPermissionOverlay
      email={session.user.email}
      permission="canAccessAppsTdsAdmin"
    >
      <div>
        <h1 className={title()}>{t("title")}</h1>
        <h2 className={subtitle({ class: "mt-4" })}>{t("subtitle")}</h2>

        <div className="py-3">
          <Snippet hideCopyButton hideSymbol variant="flat">
            <span>{t("code")}</span>
          </Snippet>
        </div>

        <div className="py-3" />

        <ServerSchemaAndTableSelector nonce={nonce || undefined} />
      </div>
    </WithPermissionOverlay>
  );
}
