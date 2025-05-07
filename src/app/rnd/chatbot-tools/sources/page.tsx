import { title, subtitle } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import UserAccessBoards from "@/components/boards/UserAccess";
import { SourcesManagementDashboard } from "@/components/rnd/chatbot/SourcesManagementDashboard";

export default async function SourcesPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <SourcesPageContent session={session} />;
}

function SourcesPageContent({ session }: { session: any }) {
  if (!session) return <UnAuthenticated />;

  return (
    <UserAccessBoards boardType="canAccessRnd" email={session.user.email}>
      <div>
        <h1 className={title()}>Sources Management</h1>
        <h2 className={subtitle({ class: "mt-6 mb-6" })}>
          Manage ChromaDB sources by collection
        </h2>
        <SourcesManagementDashboard />
      </div>
    </UserAccessBoards>
  );
}
