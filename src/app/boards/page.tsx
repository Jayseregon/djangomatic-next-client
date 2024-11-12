import { useTranslations } from "next-intl";

import { siteConfig } from "@/src/config/site";
import { title, subtitle } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { BoardCard } from "@/src/components/boards/BoardCard";

export default async function BoardsPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <BoardsPageContent session={session} />;
}

function BoardsPageContent({ session }: { session: any }) {
  const t = useTranslations("Boards");

  if (!session) return <UnAuthenticated />;

  return (
    <div className="mx-auto space-y-16">
      <div>
        <h1 className={title()}>{t("title")}</h1>
        <h2 className={subtitle({ className: "text-foreground, mt-4" })}>
          {t("subtitle")}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {siteConfig.boardsNavItems.map((board) => (
          <BoardCard
            key={board.label}
            href={board.href}
            target={board.target}
          />
        ))}
      </div>
    </div>
  );
}
