import { useTranslations } from "next-intl";

import { title } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { UserAccessRnDBoard } from "@/components/rnd/UserAccess";

export default async function UserPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <UserPageContent session={session} />;
}

function UserPageContent({ session }: { session: any }) {
  const t = useTranslations("RnD");

  if (!session) return <UnAuthenticated />;

  return (
    <div className="mx-auto space-y-16">
      <div className="flex flex-col">
        <h1 className={title()}>{t("title")}</h1>
        <h2 className={title({ size: "xs" })}>{t("subtitle")}</h2>
      </div>
      <UserAccessRnDBoard email={session.user.email} />
    </div>
  );
}
