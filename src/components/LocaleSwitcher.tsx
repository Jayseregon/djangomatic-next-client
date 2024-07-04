"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { ChangeEvent, Key, ReactNode, useTransition } from "react";
import { useRouter, usePathname } from "@/navigation";
import { locales } from "@/config";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const preferredLocale = localStorage.getItem("preferredLocale");

  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(locale: Key) {
    localStorage.setItem("preferredLocale", locale.toString());
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: locale }
      );
    });
  }

  return (
    <Dropdown>
      <DropdownTrigger>{t("locale", { locale })}</DropdownTrigger>
      <DropdownMenu
        aria-label={t("label")}
        selectedKeys={[locale]}
        onAction={onSelectChange}>
        {locales.map((curLocale) => (
          <DropdownItem
            key={curLocale}
            textValue={curLocale}>
            {t("locale", { locale: curLocale })}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
