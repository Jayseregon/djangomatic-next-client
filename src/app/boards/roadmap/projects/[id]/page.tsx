import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import ProjectView from "@/components/boards/roadmap/ProjectView";

export default async function RoadmapBoardPage({ params }: { params: any }) {
  const session = await auth();
  const { id } = await params;

  if (!session) return <UnAuthenticated />;

  return <ProjectView projectId={id} session={session} />;
}
