import { auth } from "@/auth";
import { VideoPageContent } from "@/src/components/docs/VideoPageContent";

export default async function VideosPage() {
  const session = await auth();

  return <VideoPageContent session={session} />;
}
