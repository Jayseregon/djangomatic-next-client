import { HeartFooterIcon } from "@/components/icons";
import { Navbar } from "@/components/navbar";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="relative flex flex-col h-screen">
        <Navbar />

        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
          {children}
        </main>

        <footer className="w-full flex items-center justify-center py-3 text-default-300 space-x-1">
          <span>Made with</span>
          <HeartFooterIcon size={20} />
          <span>in Canada</span>
          <span>&copy; {new Date().getFullYear()} Telecon Design</span>
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
