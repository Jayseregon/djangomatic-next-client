import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { HeartFooterIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

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
    width: 'device-width',
    initialScale: 1,
    // maximumScale: 1,
    // userScalable: false,
};

export default function RootLayout({children}: {children: React.ReactNode;}) {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
                <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>

                    <div className="relative flex flex-col h-screen">

                        <Navbar />

                        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
                            {children}
                        </main>

                        <footer className="w-full flex items-center justify-center py-3 text-default-300 space-x-1">
                            <span>Made with</span>
                            <HeartFooterIcon size={20}/>
                            <span>in Canada</span>
                            <span>&copy; {new Date().getFullYear()} Telecon Design</span>
                        </footer>

                    </div>
                </Providers>
            </body>
        </html>
    );
}
