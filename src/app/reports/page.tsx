import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { TowerReportsDashboard } from "@/src/components/reports/TowerReportsDashboard";

export default async function ReportsPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <ReportsPageContent session={session} />;
}

function ReportsPageContent({ session }: { session: any }) {
  if (!session) return <UnAuthenticated />;

  return (
    <div>
      <TowerReportsDashboard />
    </div>
  );
}
