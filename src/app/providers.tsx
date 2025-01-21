"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes";
import { createContext, type JSX } from "react";
import { SessionProvider } from "next-auth/react";

// Create the NonceContext
const NonceContext = createContext<string | undefined>(undefined);

export { NonceContext };

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  nonce?: string;
}

/**
 * Providers component wraps its children with HeroUIProvider and NextThemesProvider.
 * It provides theme and navigation context to the entire application.
 *
 * @param {Object} props - The props for the Providers component.
 * @param {React.ReactNode} props.children - The children components to be wrapped by the providers.
 * @param {ThemeProviderProps} [props.themeProps] - Optional theme properties for the NextThemesProvider.
 * @param {string} [props.nonce] - Optional nonce for the NextThemesProvider.
 * @returns {JSX.Element} The rendered Providers component.
 */
export function Providers({
  children,
  themeProps,
  nonce,
}: ProvidersProps): JSX.Element {
  const router = useRouter();

  return (
    <SessionProvider>
      <NonceContext.Provider value={nonce}>
        <HeroUIProvider navigate={router.push}>
          <NextThemesProvider {...themeProps} nonce={nonce}>
            {children}
          </NextThemesProvider>
        </HeroUIProvider>
      </NonceContext.Provider>
    </SessionProvider>
  );
}
