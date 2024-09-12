import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";

import { SunThemeIcon, MoonThemeIcon } from "@/components/icons";

interface ThemeSwitchProps {
  className?: string;
  nonce?: string;
}

/**
 * ThemeSwitch component toggles between light and dark themes.
 * It uses the next-themes library to manage theme state and updates.
 *
 * @param {Object} props - The props for the ThemeSwitch component.
 * @param {string} [props.className] - Optional class name for the button.
 * @param {string} [props.nonce] - Optional nonce for the button.
 * @returns {JSX.Element | null} The rendered ThemeSwitch component or null if not mounted.
 */
export const ThemeSwitch = ({
  className,
  nonce,
}: ThemeSwitchProps): JSX.Element | null => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Component is now mounted, and we can safely perform client-side operations
    setMounted(true);
  }, []);

  /**
   * Toggles the theme between light and dark.
   */
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Only render the button after the component has mounted
  if (!mounted) {
    return null;
  }

  return (
    <div>
      <Button
        aria-label="Toggle theme"
        className={className}
        color={undefined}
        isIconOnly={true}
        nonce={nonce}
        size="sm"
        variant={undefined}
        onPress={toggleTheme}>
        {theme === "dark" ? <SunThemeIcon /> : <MoonThemeIcon />}
      </Button>
    </div>
  );
};
