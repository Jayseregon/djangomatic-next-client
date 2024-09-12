// import { useTranslations } from "next-intl";
// import { headers } from "next/headers";
// import { title, subtitle } from "@/components/primitives";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { auth } from "@/auth";
import { WithPermissionOverlay } from "@/src/components/auth/withPermissionOverlay";
import PathInDev from "@/src/components/path-in-dev";

export default async function SaasPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <SaasPageContent session={session} />;
}

function SaasPageContent({ session }: { session: any }) {
  // const t = useTranslations();
  // const nonce = headers().get("x-nonce");

  return (
    <WithPermissionOverlay
      email={session.user.email}
      permission="canAccessAppsTdsLLD"
    >
      <PathInDev />
    </WithPermissionOverlay>
  );
}
