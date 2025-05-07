import { useTranslations } from "next-intl";

import { title, subtitle } from "@/components/primitives";
import { auth } from "@/auth";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { UserAccessRnDSection } from "@/src/components/rnd/UserAccess";
import ErrorBoundary from "@/src/components/error/ErrorBoundary";
import { ChatbotTrackingBoard } from "@/src/components/chatbot/ChatbotTrackingBoard";

export default async function ChatTrackingSidePage() {
  const session = await auth();

  if (!session) return <UnAuthenticated />;

  return <ChatTrackingPageContent session={session} />;
}

function ChatTrackingPageContent({ session }: { session: any }) {
  const t = useTranslations("RnD.chatbotTracking");

  if (!session || !session.user || !session.user.email)
    return <UnAuthenticated />;

  return (
    <UserAccessRnDSection email={session.user.email}>
      <div>
        <h1 className={title()}>{t("title")}</h1>
        <h2 className={subtitle({ class: "mt-4" })}>{t("subtitle")}</h2>

        <div className="mt-8">
          <ErrorBoundary
            fallback={<div>Error loading chatbot tracking data</div>}
          >
            <ChatbotTrackingBoard />
          </ErrorBoundary>
        </div>
      </div>
    </UserAccessRnDSection>
  );
}
