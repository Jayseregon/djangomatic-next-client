import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import AllCardsView from "@/components/boards/roadmap/AllCardsView";

export default async function RoadmapBoardPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <AllCardsView session={session} />;
}
