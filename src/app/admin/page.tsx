import { title } from "@/components/primitives";
// import { useTranslations } from "next-intl";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { UserAccessAdmin } from "@/src/components/admin/UserAccess";

export default async function AdminPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <AdminPageContent session={session} />;
}

function AdminPageContent({ session }: { session: any }) {
  if (!session) return <UnAuthenticated />;

  // const t = useTranslations("Boards");

  return (
    <div className="mx-auto">
      <h1 className={title()}>Admin Dashboard</h1>

      <div className="my-10" />

      <UserAccessAdmin email={session.user.email} />
    </div>
  );
}
