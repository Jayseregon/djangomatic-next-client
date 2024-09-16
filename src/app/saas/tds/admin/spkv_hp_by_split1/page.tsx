import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { auth } from "@/auth";
import { DatabaseSchema2Selector } from "@/src/components/saas/serverSelectors";
import { WithPermissionOverlay } from "@/src/components/auth/withPermissionOverlay";
import { AppPageTitle } from "@/src/components/saas/appPageTitle";
import { StartTaskButton } from "@/src/components/saas/startTaskButton";
import { InputDataProvider } from "@/src/components/saas/inputDataProviders";
import { ConsoleDisplay } from "@/src/components/saas/consoleDisplay";

/**
 * SaasPage component handles authentication and renders the SaasPageContent if the user is authenticated.
 *
 * @returns {JSX.Element} The rendered SaasPage component.
 */
export default async function SaasPage(): Promise<JSX.Element> {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <SaasPageContent session={session} />;
}

/**
 * SaasPageContent component renders the main content of the SaaS page.
 * It includes the AppPageTitle, DatabaseSchemaTableSelector, and AnotherComponent.
 *
 * @param {Object} props - The props for the SaasPageContent component.
 * @param {any} props.session - The session object containing user information.
 * @returns {JSX.Element} The rendered SaasPageContent component.
 */
function SaasPageContent({ session }: { session: any }): JSX.Element {
  const endpoint = "/saas/tds/ajax/query-compile-hp-by-splits1/";

  return (
    <WithPermissionOverlay
      email={session.user.email}
      permission="canAccessAppsTdsAdmin"
    >
      <div className="space-y-5">
        <AppPageTitle client="tds_saas" />
        <InputDataProvider>
          <DatabaseSchema2Selector
            appType="hld"
            dbClass="db_class_spokane_valley"
          />
          <ConsoleDisplay />
          <StartTaskButton taskEndpoint={endpoint} />
        </InputDataProvider>
      </div>
    </WithPermissionOverlay>
  );
}
