import { Snippet } from "@nextui-org/snippet";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Bug, SquareArrowOutUpRight } from "lucide-react";
import { Suspense } from "react";

import { title, subtitle } from "@/components/primitives";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { auth } from "@/auth";
import AppName from "@/components/ui/AppName";
import LottieAnimation from "@/components/ui/LottieAnimation";
import { LoadingContent } from "@/components/ui/LoadingContent";

/**
 * RootPage component sets the request locale and renders the HomeContent component.
 * It fetches the user session and passes it to the HomeContent component.
 *
 * @param {Object} props - The props for the RootPage component.
 * @param {Object} props.params - The parameters for the RootPage component.
 * @param {string} props.params.locale - The locale to be set for the request.
 * @returns {JSX.Element} The rendered RootPage component.
 */
export default async function RootPage(props: {
  params: Promise<{ locale: string }>;
}): Promise<JSX.Element> {
  const params = await props.params;

  const { locale } = params;

  const session = await auth();

  setRequestLocale(locale);

  return <HomeContent session={session} />;
}

/**
 * HomeContent component renders the main content of the home page.
 * It displays the site name, introduction, description, features, bug report info, and a call to action.
 * If the user is not authenticated, it displays the UnAuthenticated component.
 *
 * @param {Object} props - The props for the HomeContent component.
 * @param {any} props.session - The session object containing user information.
 * @returns {JSX.Element} The rendered HomeContent component.
 */
function HomeContent({ session }: { session: any }): JSX.Element {
  const t = useTranslations("HomePage");

  if (!session) return <UnAuthenticated />;

  // Retrieve the href for 'Boards' from navItemsBase
  const boardsHref = "/boards/bug-report";

  return (
    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
      <div className="max-w-3xl text-center space-y-4">
        <AppName />
        <div>
          <h1 className={title()}>{t("HeroTitle")}</h1>
        </div>
      </div>

      <Suspense fallback={<LoadingContent />}>
        <LottieAnimation className="max-w-3xl" src="/lottie/animation.lottie" />
      </Suspense>

      <div className="max-w-3xl text-justify space-y-4">
        <h2 className={subtitle({ class: "text-foreground" })}>
          {t("Description1")}
        </h2>
        <h2 className={subtitle({ class: "text-foreground" })}>
          {t("Description2")}
        </h2>
      </div>

      <Snippet hideCopyButton hideSymbol variant="flat">
        <div className="inline-flex space-x-2 items-center">
          <Bug color="#dc2626" />
          <p className="text-center pt-1 text-red-800 dark:text-red-300 flex items-center">
            {t("BugReport")}
          </p>
          <Link className="flex items-center" href={boardsHref}>
            <SquareArrowOutUpRight color="#dc2626" />
          </Link>
        </div>
      </Snippet>
    </section>
  );
}
