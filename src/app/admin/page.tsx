import { title } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { UserAccessAdmin } from "@/src/components/admin/UserAccess";

/**
 * AdminPage - The main component for the admin page.
 * It checks if the user is authenticated and renders the appropriate content.
 *
 * @returns {JSX.Element} The admin page content or an unauthenticated message.
 */
export default async function AdminPage(): Promise<JSX.Element> {
  // Fetch the current session to check if the user is authenticated
  const session = await auth();

  // If there is no session, render the UnAuthenticated component
  if (!session) return <UnAuthenticated />;

  // If the user is authenticated, render the AdminPageContent component
  return <AdminPageContent session={session} />;
}

/**
 * AdminPageContent - The content component for the admin page.
 * It renders the admin dashboard and user access management.
 *
 * @param {Object} props - The component props.
 * @param {any} props.session - The current user session.
 * @returns {JSX.Element} The admin page content or an unauthenticated message.
 */
function AdminPageContent({ session }: { session: any }): JSX.Element {
  // If there is no session, render the UnAuthenticated component
  if (!session) return <UnAuthenticated />;

  // Render the admin dashboard and user access management
  return (
    <div className="mx-auto space-y-16">
      <h1 className={title()}>Admin Dashboard</h1>
      <UserAccessAdmin email={session.user.email} />
    </div>
  );
}
