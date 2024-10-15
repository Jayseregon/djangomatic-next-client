import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";

import { NextIntlClientProvider } from "next-intl";
import clsx from "clsx";
import { ReactNode } from "react";
import { getLocale, getMessages } from "next-intl/server";
import { headers } from "next/headers";
import { unstable_setRequestLocale } from "next-intl/server";

import { siteConfig } from "@/config/site";
import { fontSans, fontMono } from "@/config/fonts";
import { auth } from "@/auth";
import { Navbar } from "@/src/components/ui/navbar";
import { Footer } from "@/src/components/ui/footer";

import { Providers } from "./providers";

type Props = {
  children: ReactNode;
  //   params: { locale: string };
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: siteConfig.icon,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  // maximumScale: 1,
  // userScalable: false,
};

const locales = ["en", "fr"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children }: Props) {
  const nonce = headers().get("x-nonce");
  const locale = await getLocale();
  const messages = await getMessages();
  const session = await auth();

  unstable_setRequestLocale(locale);

  return (
    <html suppressHydrationWarning lang={locale} nonce={nonce || undefined}>
      <head nonce={nonce || undefined} />
      <body
        className={clsx(
          "min-h-max bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
        nonce={nonce || undefined}
      >
        <Providers
          nonce={nonce || undefined}
          themeProps={{ attribute: "class", defaultTheme: "dark", children }}
        >
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
        </Providers>
      </body>
    </html>
  );
}
