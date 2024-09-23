import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { auth } from "@/auth";
import { DatabaseSchemaTable3Selector } from "@/src/components/saas/serverSelectors";
import { WithPermissionOverlay } from "@/src/components/auth/withPermissionOverlay";
import { AppPageTitle } from "@/src/components/saas/appPageTitle";
import { StartTaskButton } from "@/src/components/saas/startTaskButton";
import { InputDataProvider } from "@/src/components/saas/inputDataProviders";
import { ConsoleDisplay } from "@/src/components/saas/consoleDisplay";
import { AppPageDescription } from "@/src/components/saas/appPageDescription";
// import dynamic from "next/dynamic";
// import { useMemo } from "react";

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
  const client = "tds_saas";

  // const Map = useMemo(
  //   () =>
  //     dynamic(() => import("@/components/mapping/Map"), {
  //       loading: () => <p>A map is loading</p>,
  //       ssr: false,
  //     }),
  //   []
  // );

  return (
    <WithPermissionOverlay
      email={session.user.email}
      permission="canAccessAppsTdsLLD"
    >
      <div className="space-y-5 mb-5">
        <InputDataProvider>
          {/* Automatically detects and displays the app name */}
          <AppPageTitle client={client} />
          {/* Automatically detects and displays the app description, version, and update date */}
          <AppPageDescription client={client} />
          {/* Allows the user to select a database, schema, DFN */}
          <DatabaseSchemaTable3Selector
            pattern="*Poles*"
            tableDescription="node_p_calc"
          />
          {/* Shows the console output */}
          <ConsoleDisplay />
          {/* Starts the task */}
          <StartTaskButton />
          {/* <div className="mx-auto w-[40rem] h-[25rem]">
            <Map posix={[45.4942495, -73.7408609]} />
          </div> */}
        </InputDataProvider>
      </div>
    </WithPermissionOverlay>
  );
}
