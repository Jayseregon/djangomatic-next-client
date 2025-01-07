import type { JSX } from "react";

import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { DashboardManager } from "@/components/reports/DashboardManager";

/**
 * ReportsPage - The main component for the reports page.
 * It checks if the user is authenticated and renders the appropriate content.
 *
 * @returns {Promise<JSX.Element>} The reports page content or an unauthenticated message.
 */
export default async function ReportsPage(): Promise<JSX.Element> {
  // Fetch the current session to check if the user is authenticated
  const session = await auth();

  // Add validation for session and user email
  if (!session?.user?.email) return <UnAuthenticated />;

  // Only pass the session if it's valid
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
  // Double-check session validity (defensive programming)
  if (!session?.user?.email) return <UnAuthenticated />;

  // Render the reports dashboard
  return <DashboardManager email={session.user.email} />;
}
