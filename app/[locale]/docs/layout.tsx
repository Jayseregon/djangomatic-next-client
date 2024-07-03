import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export default async function DocsLayout({
    children,
    params: {locale}
  }: {
    children: React.ReactNode;
    params: {locale: string};
  }) {

    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages}>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-lg text-center justify-center">
                    {children}
                </div>
            </section>
        </NextIntlClientProvider>
    );
}

