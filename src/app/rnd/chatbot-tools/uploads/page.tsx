import { title, subtitle } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import UserAccessBoards from "@/components/boards/UserAccess";
import { UploadsUtilityDashboard } from "@/components/rnd/chatbot/UploadsUtilityDashboard";

export default async function UploadsPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <UploadsPageContent session={session} />;
}

function UploadsPageContent({ session }: { session: any }) {
  if (!session) return <UnAuthenticated />;

  return (
    <UserAccessBoards boardType="canAccessRnd" email={session.user.email}>
      <div>
        <h1 className={title()}>Uploads Management</h1>
        <h2 className={subtitle({ class: "mt-6 mb-6" })}>
          Manage ChromaDB Uploads by collection
        </h2>
        <UploadsUtilityDashboard />
      </div>
    </UserAccessBoards>
  );
}
