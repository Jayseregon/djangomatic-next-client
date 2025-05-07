import { title, subtitle } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import UserAccessBoards from "@/components/boards/UserAccess";
import { HealthCheckDashboard } from "@/components/rnd/chatbot/HealthCheckDashboard";

export default async function HealthCheckPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <HealthCheckPageContent session={session} />;
}

function HealthCheckPageContent({ session }: { session: any }) {
  if (!session) return <UnAuthenticated />;

  return (
    <UserAccessBoards boardType="canAccessRnd" email={session.user.email}>
      <div>
        <h1 className={title()}>Health Check</h1>
        <h2 className={subtitle({ class: "mt-6 mb-6" })}>
          Check the health of the ChromaDB instance and collections
        </h2>
        <HealthCheckDashboard />
      </div>
    </UserAccessBoards>
  );
}
