import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";

import { NextIntlClientProvider } from "next-intl";
import clsx from "clsx";
import { ReactNode } from "react";
import { getLocale, getMessages } from "next-intl/server";
import { headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";

import { siteConfig } from "@/config/site";
import { fontSans, fontMono } from "@/config/fonts";
import { auth } from "@/auth";
import { Navbar } from "@/src/components/root/Navbar";
import { Footer } from "@/src/components/root/Footer";
import { Providers } from "@/src/app/providers";

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
  const nonce = (await headers()).get("x-nonce") || "";
  const locale = await getLocale();
  const messages = await getMessages();
  const session = await auth();

  setRequestLocale(locale);

  return (
    <html suppressHydrationWarning lang={locale} nonce={nonce}>
      <head nonce={nonce} />
      <body
        className={clsx(
          "min-h-max bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
        nonce={nonce}
      >
        <Providers
          nonce={nonce}
          themeProps={{ attribute: "class", defaultTheme: "dark", children }}
        >
          <NextIntlClientProvider messages={messages}>
            <div className="relative flex flex-col h-screen" nonce={nonce}>
              <Navbar nonce={nonce} session={session} />

              <main
                className="container mx-auto max-w-full pt-24 px-6 flex-grow"
                nonce={nonce}
              >
                {children}
              </main>

              <Footer nonce={nonce} />
            </div>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
