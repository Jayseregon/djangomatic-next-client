"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useEffect, useTransition } from "react";
import { useRouter, usePathname } from "@/navigation";
import { locales } from "@/config";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  useEffect(() => {
    const preferredLocale = localStorage.getItem("preferredLocale");
    if (preferredLocale && preferredLocale !== locale) {
      document.cookie = `NEXT_LOCALE=${preferredLocale}; path=/; max-age=31536000; SameSite=Lax`;
      startTransition(() => {
        router.replace({ pathname }, { locale: preferredLocale as "en" | "fr" | undefined });
      });
    }
  }, [locale, pathname, router, startTransition]);

  function onSelectChange(locale: string) {
    localStorage.setItem("preferredLocale", locale);
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;

    startTransition(() => {
      router.replace({ pathname }, { locale: locale as "en" | "fr" | undefined });
    });
  }

  return (
    <Dropdown>
      <DropdownTrigger>{t("locale", { locale })}</DropdownTrigger>
      <DropdownMenu
        aria-label={t("label")}
        selectedKeys={[locale]}
        onAction={(key) => onSelectChange(key as string)}>
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
