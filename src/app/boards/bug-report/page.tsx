import { useTranslations } from "next-intl";

import { title } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { BugsManager } from "@/src/components/boards/bugs/BugsManager";
import UserAccessBoards from "@/src/components/boards/UserAccess";

export default async function BoardsPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <BoardsPageContent session={session} />;
}

function BoardsPageContent({ session }: { session: any }) {
  const t = useTranslations("Boards.bugReport");

  if (!session) return <UnAuthenticated />;

  return (
    <UserAccessBoards
      boardType="canAccessBugReportBoard"
      email={session.user.email}
    >
      <div>
        <h1 className={title()}>{t("title")}</h1>
        <BugsManager sessionUsername={session.user.name} />
      </div>
    </UserAccessBoards>
  );
}
