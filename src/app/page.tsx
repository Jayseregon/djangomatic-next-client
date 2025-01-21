import { setRequestLocale } from "next-intl/server";
import { type JSX } from "react";

import { auth } from "@/auth";
import HomeContent from "@/src/components/root/HomeContent";

/**
 * RootPage component sets the request locale and renders the HomeContent component.
 * It fetches the user session and passes it to the HomeContent component.
 *
 * @param {Object} props - The props for the RootPage component.
 * @param {Object} props.params - The parameters for the RootPage component.
 * @param {string} props.params.locale - The locale to be set for the request.
 * @returns {JSX.Element} The rendered RootPage component.
 */
export default async function RootPage(props: {
  params: Promise<{ locale: string }>;
}): Promise<JSX.Element> {
  const params = await props.params;

  const { locale } = params;

  const session = await auth();

  setRequestLocale(locale);

  return <HomeContent session={session} />;
}
