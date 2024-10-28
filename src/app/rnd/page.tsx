import { title } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { UserAccessRnD } from "@/components/rnd/UserAccess";

export default async function UserPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <UserPageContent session={session} />;
}

function UserPageContent({ session }: { session: any }) {
  if (!session) return <UnAuthenticated />;

  return (
    <div className="mx-auto space-y-16">
      <h1 className={title()}>R&amp;D Tasks Dashboard</h1>
      <UserAccessRnD email={session.user.email} />
    </div>
  );
}
