import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { title } from "@/src/components/primitives";
import { TowerReportsDashboard } from "@/src/components/reports/TowerReportsDashboard";
import UserAccessReports from "@/src/components/reports/UserAccess";

/**
 * ReportsPage - The main component for the reports page.
 * It checks if the user is authenticated and renders the appropriate content.
 *
 * @returns {Promise<JSX.Element>} The reports page content or an unauthenticated message.
 */
export default async function ReportsPage(): Promise<JSX.Element> {
  // Fetch the current session to check if the user is authenticated
  const session = await auth();

  // If there is no session, render the UnAuthenticated component
  if (!session) return <UnAuthenticated />;

  // If the user is authenticated, render the ReportsPageContent component
  return <ReportsPageContent session={session} />;
}

/**
 * ReportsPageContent - The content component for the reports page.
 * It renders the reports dashboard.
 *
 * @param {Object} props - The component props.
 * @param {any} props.session - The current user session.
 * @returns {JSX.Element} The reports page content or an unauthenticated message.
 */
function ReportsPageContent({ session }: { session: any }): JSX.Element {
  // If there is no session, render the UnAuthenticated component
  if (!session) return <UnAuthenticated />;

  // Render the reports dashboard
  return (
    <UserAccessReports email={session.user.email}>
      <div className="mx-auto space-y-16">
        <h1 className={title()}>PCI Reports</h1>
        <TowerReportsDashboard />
      </div>
    </UserAccessReports>
  );
}
