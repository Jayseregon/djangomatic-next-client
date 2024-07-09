import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import {
  SunThemeIcon,
  MoonThemeIcon,
} from "@/components/icons";

interface ThemeSwitchProps {
  className?: string;
  nonce?: string;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  className,
  nonce,
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Component is now mounted, and we can safely perform client-side operations
    setMounted(true);
  }, []);

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
        isIconOnly={true}
        color={undefined}
        aria-label="Toggle theme"
        size="sm"
        onPress={toggleTheme}
        className={className}
        variant={undefined}
        nonce={nonce}>
        {theme === "dark" ? <SunThemeIcon /> : <MoonThemeIcon />}
      </Button>
    </div>
  );
};
