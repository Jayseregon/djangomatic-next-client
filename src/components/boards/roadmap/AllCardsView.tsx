"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import { title } from "@/components/primitives";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import UserAccessBoards from "@/src/components/boards/UserAccess";

const RoadmapBoard = dynamic(
  () => import("@/components/boards/roadmap/RoadmapBoard"),
  {
    ssr: false,
  },
);

export default function AllCardsView({ session }: { session: any }) {
  const t = useTranslations("Boards.roadmap");

  if (!session) return <UnAuthenticated />;

  return (
    <UserAccessBoards
      boardType="canAccessRoadmapBoard"
      email={session.user.email}
    >
      <div className="space-y-10">
        <div>
          <h1 className={title()}>{t("title")}</h1>
        </div>
        <RoadmapBoard />
      </div>
    </UserAccessBoards>
  );
}
