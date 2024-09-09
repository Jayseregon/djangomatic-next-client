import { useTranslations } from "next-intl";

import { title, subtitle } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/unAuthenticated";
import { UserAccessRnD } from "@/src/components/rnd/UserAccess";

export default async function RnDPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <RnDPageContent session={session} />;
}

function RnDPageContent({ session }: { session: any }) {
  const t = useTranslations("RnD");

  if (!session) return <UnAuthenticated />;

  return (
    <div>
      <h1 className={title()}>{t("title")}</h1>
      <h2 className={subtitle({ class: "mt-4" })}>{t("subtitle")}</h2>
      <UserAccessRnD email={session.user.email} />
    </div>
  );
}
