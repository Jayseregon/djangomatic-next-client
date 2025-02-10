import { useTranslations } from "next-intl";

import { title, subtitle } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { AppTrackingBoard } from "@/src/components/rnd/tracking/AppTrackingBoard";
import { UserAccessRnDSection } from "@/src/components/rnd/UserAccess";
import ErrorBoundary from "@/src/components/error/ErrorBoundary";

export default async function AppTrackingSidePage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <AppTrackkingPageContent session={session} />;
}

function AppTrackkingPageContent({ session }: { session: any }) {
  const t = useTranslations("RnD.appTracking");

  if (!session) return <UnAuthenticated />;

  return (
    <UserAccessRnDSection email={session.user.email}>
      <div>
        <h1 className={title()}>{t("title")}</h1>
        <h2 className={subtitle({ class: "mt-4" })}>{t("subtitle")}</h2>
        <ErrorBoundary fallback={<div>Error loading tracking data</div>}>
          <AppTrackingBoard />
        </ErrorBoundary>
      </div>
    </UserAccessRnDSection>
  );
}
