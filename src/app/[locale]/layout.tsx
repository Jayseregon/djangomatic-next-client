import { HeartFooterIcon } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { headers } from "next/headers";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const nonce = headers().get("x-nonce");

  return (
    <NextIntlClientProvider messages={messages}>
      <div
        className="relative flex flex-col h-screen"
        nonce={nonce || undefined}>
        <Navbar nonce={nonce || undefined} />

        <main
          className="container mx-auto max-w-full pt-24 px-6 flex-grow"
          nonce={nonce || undefined}>
          {children}
        </main>

        <footer
          className="w-full flex items-center justify-center py-3 text-slate-300 dark:text-slate-700 space-x-1"
          nonce={nonce || undefined}>
          <span>Made with</span>
          <HeartFooterIcon size={20} />
          <span>in Canada</span>
          <span>&copy; {new Date().getFullYear()} Telecon Design</span>
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
