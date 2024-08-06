"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Link,
} from "@nextui-org/react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

// import { SearchInput } from "@/components/SearchInput";
import LocaleSwitcher from "./LocaleSwitcher";

interface NavbarProps {
  nonce?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ nonce }) => {
  // Navbar state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("UserProfile");

  return (
    // brand definition
    <NextUINavbar
      className="border-b border-slate-300 dark:border-slate-700 fixed"
      isMenuOpen={isMenuOpen}
      maxWidth="2xl"
      nonce={nonce}
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent nonce={nonce}>
        <NavbarBrand
          as="li"
          className="gap-3 max-w-fit"
          nonce={nonce}>
          <Link
            className="flex justify-start items-center gap-4"
            color="foreground"
            href="/"
            nonce={nonce}>
            <Logo nonce={nonce} />
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* navbar menu  */}
      <NavbarContent
        justify="center"
        nonce={nonce}>
        {/* toggle menu */}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          className="md:hidden"
          nonce={nonce}
        />

        {/* or list items menu */}
        <ul className="hidden md:flex items-start justify-start gap-16">
          {siteConfig.navItems.map((item, index) => (
            <NavbarItem
              key={`${item}-${index}-navbar`}
              nonce={nonce}>
              <Link
                color="foreground"
                href={item.href}
                nonce={nonce}
                underline="hover">
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      {/* avatar menu with theme switch and search */}
      <NavbarContent
        justify="end"
        nonce={nonce}>
        {/* <NavbarItem
          className="hidden md:flex"
          nonce={nonce}>
          <SearchInput />
        </NavbarItem> */}

        <NavbarItem nonce={nonce}>
          <ThemeSwitch
            className="text-foreground bg-transparent hover:bg-primary-100"
            nonce={nonce}
          />
        </NavbarItem>

        <NavbarItem nonce={nonce}>
          <LocaleSwitcher nonce={nonce} />
        </NavbarItem>

        <Dropdown
          nonce={nonce}
          placement="bottom-end">
          <DropdownTrigger nonce={nonce}>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Demo User"
              size="sm"
              nonce={nonce}
              src="https://i.pravatar.cc/150?img=27" // deactivate if bug
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            nonce={nonce}
            variant="flat">
            <DropdownItem
              key="profile"
              className="h-14 gap-2"
              nonce={nonce}
              textValue="Signed In profile name">
              <p className="font-semibold">{t("dItemSignedInTitle")}</p>
              <p className="font-semibold">{t("dItemUserName")}</p>
            </DropdownItem>
            <DropdownItem
              key="settings"
              nonce={nonce}
              textValue="My Settings">
              {t("dItemSettings")}
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              nonce={nonce}
              textValue="Log Out">
              {t("dItemLogOut")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      {/* menu definition when toggled */}
      <NavbarMenu nonce={nonce}>
        {/* <SearchInput alwaysExpanded={true} /> */}
        <div className="mx-4 mt-2 flex flex-col gap-3">
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem
              key={`${item}-${index}-dropdown`}
              nonce={nonce}>
              <Link
                className="w-full"
                color="foreground"
                href={item.href}
                nonce={nonce}
                size="lg"
                onPress={() => {
                  setIsMenuOpen((prev) => !prev);
                }}>
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
