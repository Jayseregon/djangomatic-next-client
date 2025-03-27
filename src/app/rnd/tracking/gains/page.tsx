import { useTranslations } from "next-intl";

import { title, subtitle } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { UserAccessRnDSection } from "@/src/components/rnd/UserAccess";
import ErrorBoundary from "@/src/components/error/ErrorBoundary";
import { GainsTrackingDashboard } from "@/src/components/rnd/tracking/gains/GainsTrackingDashboard";

export default async function GainsTrackingSidePage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <GainsTrackingPageContent session={session} />;
}

function GainsTrackingPageContent({ session }: { session: any }) {
  const t = useTranslations("RnD.gainsTracking");

  if (!session) return <UnAuthenticated />;

  return (
    <UserAccessRnDSection email={session.user.email}>
      <div>
        <h1 className={title()}>{t("title")}</h1>
        <h2 className={subtitle({ class: "mt-4" })}>{t("subtitle")}</h2>
        <ErrorBoundary fallback={<div>Error loading tracking data</div>}>
          <GainsTrackingDashboard />
        </ErrorBoundary>
      </div>
    </UserAccessRnDSection>
  );
}
