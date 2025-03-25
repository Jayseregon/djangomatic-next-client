import { useTranslations } from "next-intl";

import { title, subtitle } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { UserAccessRnDSection } from "@/src/components/rnd/UserAccess";
import ErrorBoundary from "@/src/components/error/ErrorBoundary";
import { AppsTrackingDashboard } from "@/src/components/rnd/tracking/apps/AppsTrackingDashboard";
import { ReportsTrackingDashboard } from "@/src/components/rnd/tracking/apps/tower-reports/ReportsTrackingDashboard";

export default async function AppTrackingSidePage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <AppTrackingPageContent session={session} />;
}

// Export this component to make it directly testable
export function AppTrackingPageContent({ session }: { session: any }) {
  const t = useTranslations("RnD.appTracking");

  if (!session) return <UnAuthenticated />;

  return (
    <UserAccessRnDSection email={session.user.email}>
      <div>
        <h1 className={title()}>{t("title")}</h1>
        <h2 className={subtitle({ class: "mt-4" })}>{t("subtitle")}</h2>

        <div className="mt-8">
          <h3 className="text-xl font-bold">App Usage Tracking</h3>
          <ErrorBoundary fallback={<div>Error loading app tracking data</div>}>
            <AppsTrackingDashboard />
          </ErrorBoundary>
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-bold">Tower Report Tracking</h3>
          <ErrorBoundary
            fallback={<div>Error loading tower report tracking data</div>}
          >
            <ReportsTrackingDashboard />
          </ErrorBoundary>
        </div>
      </div>
    </UserAccessRnDSection>
  );
}
