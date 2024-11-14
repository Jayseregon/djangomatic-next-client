"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "@nextui-org/react";
import { useTransition } from "react";

import { locales } from "@/config";
import { setUserLocale } from "@/lib/locale";
import { LocaleSwitcherProps } from "@/interfaces/ui";

/**
 * LocaleSwitcher component allows users to switch between different locales.
 * It updates the user's preferred locale in local storage and cookies.
 *
 * @param {Object} props - The props for the LocaleSwitcher component.
 * @param {string} [props.nonce] - Optional nonce for the component.
 * @returns {JSX.Element} The rendered LocaleSwitcher component.
 */
export default function LocaleSwitcher({
  className,
  nonce,
}: LocaleSwitcherProps): JSX.Element {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const [, startTransition] = useTransition();

  /**
   * Handles toggling the locale.
   */
  function onToggleLocale() {
    const currentLocaleIndex = locales.indexOf(locale as "en" | "fr");
    const nextLocale = locales[(currentLocaleIndex + 1) % locales.length];

    localStorage.setItem("preferredLocale", nextLocale);
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

    startTransition(() => {
      setUserLocale(nextLocale as "en" | "fr");
    });
  }

  return (
    <Button
      isIconOnly
      aria-label={t("label")}
      className={className}
      color={undefined}
      nonce={nonce}
      size="sm"
      variant={undefined}
      onPress={onToggleLocale}
    >
      {t("localeFlag", { locale })}
    </Button>
  );
}
