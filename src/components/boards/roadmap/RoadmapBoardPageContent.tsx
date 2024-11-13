"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import { title, subtitle } from "@/components/primitives";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import UserAccessBoards from "@/src/components/boards/UserAccess";

// Dynamically import RoadmapBoard with SSR disabled
const RoadmapBoard = dynamic(
  () => import("@/components/boards/roadmap/RoadmapBoard"),
  {
    ssr: false,
  },
);

export default function RoadmapBoardPageContent({ session }: { session: any }) {
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
          <h2 className={subtitle({ class: "mt-4" })}>{t("subtitle")}</h2>
        </div>
        <RoadmapBoard />
      </div>
    </UserAccessBoards>
  );
}
