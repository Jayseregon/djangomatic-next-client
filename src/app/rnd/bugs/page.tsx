import { useTranslations } from "next-intl";

import { title, subtitle } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import UserAccessBoards from "@/src/components/boards/UserAccess";
import { BugsManager } from "@/src/components/boards/bugs/BugsManager";

export default async function BugsRnDSidePage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <BoardsPageContent session={session} />;
}

function BoardsPageContent({ session }: { session: any }) {
  const t = useTranslations("Boards.bugReport");

  if (!session) return <UnAuthenticated />;

  return (
    <UserAccessBoards boardType="canAccessRnd" email={session.user.email}>
      <div>
        <h1 className={title()}>{t("title")}</h1>
        <h2 className={subtitle({ class: "mt-4" })}>{t("subtitle")}</h2>
        <BugsManager isAdminSide sessionUsername={session.user.name} />
      </div>
    </UserAccessBoards>
  );
}
