import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { TaskManager } from "@/src/components/rnd/TaskManager";

export default async function UserPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <UserPageContent id={params.id} />;
}

function UserPageContent({ id }: { id: string }) {
  return (
    <div className="mx-auto space-y-16">
      <TaskManager id={id} />
    </div>
  );
}
