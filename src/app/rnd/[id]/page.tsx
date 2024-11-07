import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { TaskManager } from "@/src/components/rnd/TaskManager";
import { UserAccessRnDSection } from "@/src/components/rnd/UserAccess";

export default async function UserPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return (
    <UserPageContent
      id={params.id}
      session={session}
    />
  );
}

function UserPageContent({ id, session }: { id: string; session: any }) {
  if (!session) return <UnAuthenticated />;

  const taskManager = (
    <div className="mx-auto space-y-16">
      <TaskManager id={id} />
    </div>
  );

  return (
    <UserAccessRnDSection email={session.user.email}>
      {taskManager}
    </UserAccessRnDSection>
  );
}
