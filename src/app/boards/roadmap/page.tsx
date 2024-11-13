import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import RoadmapBoardPageContent from "@/components/boards/roadmap/RoadmapBoardPageContent";

export default async function RoadmapBoardPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <RoadmapBoardPageContent session={session} />;
}
