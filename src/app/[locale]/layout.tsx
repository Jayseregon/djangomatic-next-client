import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { headers } from "next/headers";
import { unstable_setRequestLocale } from "next-intl/server";

import { auth } from "@/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/src/components/footer";

// Can be imported from a shared config
const locales = ["en", "fr"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const nonce = headers().get("x-nonce");
  const session = await auth();

  unstable_setRequestLocale(locale);

  return (
    <NextIntlClientProvider messages={messages}>
      <div
        className="relative flex flex-col h-screen"
        nonce={nonce || undefined}
      >
        <Navbar nonce={nonce || undefined} session={session} />

        <main
          className="container mx-auto max-w-full pt-24 px-6 flex-grow"
          nonce={nonce || undefined}
        >
          {children}
        </main>

        <Footer nonce={nonce || undefined} />
      </div>
    </NextIntlClientProvider>
  );
}
