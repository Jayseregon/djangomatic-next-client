import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { auth } from "@/auth";
import { WithPermissionOverlay } from "@/src/components/auth/withPermissionOverlay";
import PathInDev from "@/src/components/_dev/path-in-dev";

export default async function SaasPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <SaasPageContent session={session} />;
}

function SaasPageContent({ session }: { session: any }) {
  return (
    <WithPermissionOverlay
      email={session.user.email}
      permission="canAccessGlobalQuebec"
    >
      <PathInDev />
    </WithPermissionOverlay>
  );
}
