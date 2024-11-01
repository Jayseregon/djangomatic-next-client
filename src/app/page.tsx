import { Snippet } from "@nextui-org/snippet";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { title, subtitle } from "@/components/primitives";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { auth } from "@/auth";
import AppName from "@/components/ui/AppName";
// import { DisplaySemanticColors } from "@/components/_dev/ColorCard";
// import { UserData } from "@/src/components/UserData";

/**
 * RootPage component sets the request locale and renders the HomeContent component.
 * It fetches the user session and passes it to the HomeContent component.
 *
 * @param {Object} props - The props for the RootPage component.
 * @param {Object} props.params - The parameters for the RootPage component.
 * @param {string} props.params.locale - The locale to be set for the request.
 * @returns {JSX.Element} The rendered RootPage component.
 */
export default async function RootPage({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<JSX.Element> {
  const session = await auth();

  setRequestLocale(locale);

  return <HomeContent session={session} />;
}

/**
 * HomeContent component renders the main content of the home page.
 * It displays the site name, hero title, hero subtitle, a code snippet, and semantic colors.
 * If the user is not authenticated, it displays the UnAuthenticated component.
 *
 * @param {Object} props - The props for the HomeContent component.
 * @param {any} props.session - The session object containing user information.
 * @returns {JSX.Element} The rendered HomeContent component.
 */
function HomeContent({ session }: { session: any }): JSX.Element {
  const t = useTranslations("HomePage");

  if (!session) return <UnAuthenticated />;

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="max-w-xl text-center justify-center space-y-5">
        <AppName />
        <div>
          <h1 className={title()}>{t("HeroTitle")}</h1>
          <h2 className={subtitle({ class: "mt-4" })}>{t("HeroSubtitle")}</h2>
        </div>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <p className="flex flex-col gap-2 text-center">
            <span className="text-lg pb-2">{t("code")}</span>
            <span>{t("code2")}</span>
            <span className="text-red-500">{t("code3")}</span>
          </p>
        </Snippet>
      </div>

      {/* <UserData session={session} /> */}

      {/* <DisplaySemanticColors /> */}
    </section>
  );
}
