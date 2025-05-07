import type { JSX } from "react";

import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { auth } from "@/auth";
import { ZipFileInputButton } from "@/src/components/saas/serverSelectors";
import { WithPermissionOverlay } from "@/src/components/auth/withPermissionOverlay";
import { AppPageTitle } from "@/src/components/saas/appPageTitle";
import { StartTaskButton } from "@/src/components/saas/startTaskButton";
import { InputDataProvider } from "@/src/components/saas/inputDataProviders";
import { ConsoleDisplay } from "@/src/components/saas/consoleDisplay";
import { AppPageDescription } from "@/src/components/saas/appPageDescription";

export default async function SaasPage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <SaasPageContent session={session} />;
}

function SaasPageContent({ session }: { session: any }): JSX.Element {
  const client = "cogeco_saas";

  return (
    <WithPermissionOverlay
      email={session.user.email}
      permission="canAccessAppsCogecoHLD"
    >
      <div className="space-y-5 mb-5">
        <InputDataProvider>
          {/* Automatically detects and displays the app name */}
          <AppPageTitle client={client} />
          {/* Automatically detects and displays the app description, version, and update date */}
          <AppPageDescription client={client} targetTranslation="cogecoApps" />
          {/* Allows the user to input a zip file */}
          <ZipFileInputButton />
          {/* Shows the console output */}
          <ConsoleDisplay />
          {/* Starts the task */}
          <StartTaskButton />
        </InputDataProvider>
      </div>
    </WithPermissionOverlay>
  );
}
