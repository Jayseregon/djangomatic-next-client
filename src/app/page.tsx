import { Snippet } from "@nextui-org/snippet";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import { auth } from "@/auth";
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

  unstable_setRequestLocale(locale);

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
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title({ color: "violet", size: "lg" })}>
          {siteConfig.name}
        </h1>
        <br />
        <h1 className={title()}>{t("HeroTitle")}</h1>
        <h2 className={subtitle({ class: "mt-4" })}>{t("HeroSubtitle")}</h2>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <span>{t("code")}</span>
        </Snippet>
      </div>

      {/* <UserData session={session} /> */}

      {/* <DisplaySemanticColors /> */}
    </section>
  );
}
