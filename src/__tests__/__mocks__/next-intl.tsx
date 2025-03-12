import React from "react";

// Mock the useTranslations hook
export function useTranslations() {
  return (key: string) => key;
}

// Mock the NextIntlClientProvider component
export function NextIntlClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

// Mock any other exports from next-intl that your tests might use
export function useFormatter() {
  return {
    dateTime: () => new Date().toLocaleString(),
    number: (num: number) => num.toString(),
    list: (arr: any[]) => arr.join(", "),
  };
}

const nextIntl = {
  useTranslations,
  NextIntlClientProvider,
  useFormatter,
};

export default nextIntl;
