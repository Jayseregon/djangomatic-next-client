import { Pathnames, LocalePrefix } from "next-intl/routing";
import { getCookie } from 'cookies-next';

export const defaultLocale = "en" as const;
export const locales = ["en", "fr"] as const;

export const pathnames: Pathnames<typeof locales> = {
  //   '/': '/',
};

export const localePrefix: LocalePrefix<typeof locales> = "as-needed"; // 'always';
