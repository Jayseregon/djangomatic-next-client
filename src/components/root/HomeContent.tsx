import { useTranslations } from "next-intl";
import { Snippet } from "@nextui-org/snippet";
import Link from "next/link";
import { Bug, SquareArrowOutUpRight } from "lucide-react";
import { Suspense, type JSX } from "react";

import { UnAuthenticated } from "@/components/auth/unAuthenticated";
import AppName from "@/components/ui/AppName";
import LottieAnimation from "@/components/ui/LottieAnimation";
import { LoadingContent } from "@/components/ui/LoadingContent";
import { title, subtitle } from "@/components/primitives";

export default function HomeContent({
  session,
}: {
  session: any;
}): JSX.Element {
  const t = useTranslations("HomePage");

  if (!session) return <UnAuthenticated />;

  return (
    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
      <div className="max-w-3xl text-center space-y-4">
        <AppName />
        <div>
          <h1 className={title()}>{t("HeroTitle")}</h1>
        </div>
      </div>

      <Suspense fallback={<LoadingContent />}>
        <LottieAnimation
          className="max-w-3xl"
          height={600}
          src="/lottie/animation.lottie"
          width={800}
        />
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
          <Link className="flex items-center" href="/boards/bug-report">
            <SquareArrowOutUpRight color="#dc2626" />
          </Link>
        </div>
      </Snippet>
    </section>
  );
}
