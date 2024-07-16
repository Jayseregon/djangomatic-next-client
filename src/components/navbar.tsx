"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Avatar } from "@nextui-org/avatar";
import { Link } from "@nextui-org/link";
import LocaleSwitcher from "./LocaleSwitcher";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
// import { SearchInput } from "@/components/SearchInput";
import { useTranslations } from "next-intl";

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
      maxWidth="2xl"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="border-b border-slate-300 dark:border-slate-700 fixed"
      nonce={nonce}>
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
                underline="hover"
                href={item.href}
                nonce={nonce}>
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
            nonce={nonce}
            className="text-foreground bg-transparent hover:bg-primary-100"
          />
        </NavbarItem>

        <NavbarItem nonce={nonce}>
          <LocaleSwitcher nonce={nonce} />
        </NavbarItem>

        <Dropdown
          placement="bottom-end"
          nonce={nonce}>
          <DropdownTrigger nonce={nonce}>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Demo User"
              size="sm"
              nonce={nonce}
              // src="https://i.pravatar.cc/150?img=27"
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            nonce={nonce}>
            <DropdownItem
              key="profile"
              className="h-14 gap-2"
              textValue="Signed In profile name"
              nonce={nonce}>
              <p className="font-semibold">{t("dItemSignedInTitle")}</p>
              <p className="font-semibold">{t("dItemUserName")}</p>
            </DropdownItem>
            <DropdownItem
              key="settings"
              textValue="My Settings"
              nonce={nonce}>
              {t("dItemSettings")}
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              textValue="Log Out"
              nonce={nonce}>
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
                color="foreground"
                nonce={nonce}
                className="w-full"
                href={item.href}
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
