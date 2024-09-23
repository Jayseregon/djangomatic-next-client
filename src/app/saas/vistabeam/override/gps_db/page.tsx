import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { auth } from "@/auth";
import {
  DatabaseSchema2Selector,
  ZipFileInputButton,
} from "@/src/components/saas/serverSelectors";
import { WithPermissionOverlay } from "@/src/components/auth/withPermissionOverlay";
import { AppPageTitle } from "@/src/components/saas/appPageTitle";
import { StartTaskButton } from "@/src/components/saas/startTaskButton";
import { InputDataProvider } from "@/src/components/saas/inputDataProviders";
import { ConsoleDisplay } from "@/src/components/saas/consoleDisplay";
import { AppPageDescription } from "@/src/components/saas/appPageDescription";

/**
 * SaasPage component handles authentication and renders the SaasPageContent if the user is authenticated.
 *
 * @returns {Promise<JSX.Element>} The rendered SaasPage component.
 */
export default async function SaasPage(): Promise<JSX.Element> {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <SaasPageContent session={session} />;
}

/**
 * SaasPageContent component renders the main content of the SaaS page.
 * It includes the AppPageTitle, AppPageDescription, DatabaseSchema2Selector, ConsoleDisplay, and StartTaskButton components.
 *
 * @param {Object} props - The props for the SaasPageContent component.
 * @param {any} props.session - The session object containing user information.
 * @returns {JSX.Element} The rendered SaasPageContent component.
 */
function SaasPageContent({ session }: { session: any }): JSX.Element {
  const client = "vistabeam_saas";

  return (
    <WithPermissionOverlay
      email={session.user.email}
      permission="canAccessAppsVistabeamOverride"
    >
      <div className="space-y-5 mb-5">
        <InputDataProvider>
          {/* Automatically detects and displays the app name */}
          <AppPageTitle client={client} />
          {/* Automatically detects and displays the app description, version, and update date */}
          <AppPageDescription client={client} />
          {/* Allows the user to input a zip file */}
          <ZipFileInputButton />
          {/* Allows the user to select a database, schema, DFN */}
          <DatabaseSchema2Selector appType="hld" />
          {/* Shows the console output */}
          <ConsoleDisplay />
          {/* Starts the task */}
          <StartTaskButton />
        </InputDataProvider>
      </div>
    </WithPermissionOverlay>
  );
}
