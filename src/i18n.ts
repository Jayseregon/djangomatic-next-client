import { getRequestConfig } from "next-intl/server";

import { getUserLocale } from "@/lib/locale";

/**
 * Get the request configuration for internationalization.
 *
 * @returns {Promise<{ locale: string; messages: any }>} The locale and corresponding messages.
 */
export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
