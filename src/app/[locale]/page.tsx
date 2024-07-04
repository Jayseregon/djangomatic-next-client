import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { ColorCard, ColorCardScale } from "@/components/ColorCard";

import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title({ color: "violet", size: "lg" })}>
          {siteConfig.name}
        </h1>
        <br />
        <h1 className={title()}>{siteConfig.hero_descr}</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          {siteConfig.description}
        </h2>
      </div>

      <div className="mt-8">
        <Snippet
          hideCopyButton
          hideSymbol
          variant="flat">
          <span>{t("code")}</span>
        </Snippet>
      </div>

      <div className="grid grid-cols-6 gap-2">
        <ColorCard />
        <ColorCardScale target_color="primary" />
        <ColorCardScale target_color="secondary" />
        <ColorCardScale target_color="success" />
        <ColorCardScale target_color="warning" />
        <ColorCardScale target_color="danger" />
      </div>
    </section>
  );
}
