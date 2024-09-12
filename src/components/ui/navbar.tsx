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
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { Logo } from "@/components/icons";

import { SignOut } from "./sign-in";
import LocaleSwitcher from "./LocaleSwitcher";
// import { SearchInput } from "@/components/SearchInput";

interface NavbarProps {
  nonce?: string;
  session?: any;
}

/**
 * Navbar component renders the navigation bar with various items and user profile options.
 * It includes a brand logo, navigation links, theme switcher, locale switcher, and user profile dropdown.
 *
 * @param {Object} props - The props for the Navbar component.
 * @param {string} [props.nonce] - Optional nonce for the component.
 * @param {any} [props.session] - Optional session object containing user information.
 * @returns {JSX.Element | null} The rendered Navbar component or null if the user is on the signin page.
 */
export const Navbar = ({ nonce, session }: NavbarProps): JSX.Element | null => {
  // Navbar state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("UserProfile");
  const pathname = usePathname();
  const isUnAuth = pathname === "/signin";

  if (isUnAuth) {
    return null;
  }

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
              as="button"
              className="transition-transform bg-gradient-to-tr from-[#FF705B] to-[#b249f8]"
              color={undefined}
              name="Demo User"
              nonce={nonce}
              size="md"
              src={
                session?.user
                  ? session?.user?.image
                  : "https://i.pravatar.cc/150?img=27"
              } // deactivate if bug
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
              <p className="font-semibold">
                {t("dItemSignedInTitle")}
                {session?.user ? session?.user?.name : t("dItemUserName")}
              </p>
              <p className="italic font-thin">
                {session?.user ? session?.user?.email : t("dItemUserEmail")}
              </p>
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
              <SignOut buttonName={t("dItemLogOut")} />
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
