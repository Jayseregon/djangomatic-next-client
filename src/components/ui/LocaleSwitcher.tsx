"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useTransition } from "react";

import { locales } from "@/config";
import { setUserLocale } from "@/lib/locale";

export interface LocaleSwitcherProps {
  nonce?: string;
}

/**
 * LocaleSwitcher component allows users to switch between different locales.
 * It updates the user's preferred locale in local storage and cookies.
 *
 * @param {Object} props - The props for the LocaleSwitcher component.
 * @param {string} [props.nonce] - Optional nonce for the component.
 * @returns {JSX.Element} The rendered LocaleSwitcher component.
 */
export default function LocaleSwitcher({
  nonce,
}: LocaleSwitcherProps): JSX.Element {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  const [, startTransition] = useTransition();

  /**
   * Handles the locale change event.
   *
   * @param {string} locale - The selected locale.
   */
  function onSelectChange(locale: string) {
    localStorage.setItem("preferredLocale", locale);
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;

    startTransition(() => {
      setUserLocale(locale as "en" | "fr");
    });
  }

  return (
    <Dropdown
      classNames={{
        content: "p-0 border-small border-divider bg-background",
      }}
      nonce={nonce}
      radius="sm"
    >
      <DropdownTrigger
        className="px-2 py-1 rounded-lg hover:bg-primary-100"
        nonce={nonce}
      >
        {t("localeFlag", { locale })}
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("label")}
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
        nonce={nonce}
        selectedKeys={[locale]}
        selectionMode="single"
        onAction={(key) => onSelectChange(key as string)}
      >
        {locales.map((curLocale) => (
          <DropdownItem
            key={curLocale}
            className="h-13"
            nonce={nonce}
            textValue={curLocale}
          >
            {t("locale", { locale: curLocale })}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
