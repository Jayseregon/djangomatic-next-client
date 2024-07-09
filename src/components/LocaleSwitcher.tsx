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
import { Switch } from "@nextui-org/react";

export interface LocaleSwitcherProps {
  nonce?: string;
}

export default function LocaleSwitcher({nonce}: LocaleSwitcherProps) {
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
        router.replace(
          { pathname },
          { locale: preferredLocale as "en" | "fr" | undefined }
        );
      });
    }
  }, [locale, pathname, router, startTransition]);

  function onSelectChange(locale: string) {
    localStorage.setItem("preferredLocale", locale);
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;

    startTransition(() => {
      router.replace(
        { pathname },
        { locale: locale as "en" | "fr" | undefined }
      );
    });
  }

  return (
    <Dropdown
      radius="sm"
      classNames={{
        content: "p-0 border-small border-divider bg-background",
      }}
      nonce={nonce}>
      <DropdownTrigger nonce={nonce} className="px-2 py-1 rounded-lg hover:bg-primary-100">{t("localeFlag", { locale })}</DropdownTrigger>
      <DropdownMenu
        className="p-2"
        itemClasses={{
          base: [
            "rounded-md",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-primary-200",
            "dark:data-[hover=true]:bg-primary-400",
            "data-[selectable=true]:focus:bg-primary-200",
            "data-[pressed=true]:opacity-70",
            "data-[focus-visible=true]:ring-primary-500",
          ],
        }}
        aria-label={t("label")}
        nonce={nonce}
        selectionMode="single"
        selectedKeys={[locale]}
        onAction={(key) => onSelectChange(key as string)}>
        {locales.map((curLocale) => (
          <DropdownItem
            key={curLocale}
            textValue={curLocale}
            nonce={nonce}
            className="h-13">
            {t("locale", { locale: curLocale })}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
