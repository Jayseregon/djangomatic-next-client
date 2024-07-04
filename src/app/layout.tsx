import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Providers } from "./providers";
import { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { locales } from "@/config";

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

export default function RootLayout({ children }: Props) {
  return (
    <html
      suppressHydrationWarning
      lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
