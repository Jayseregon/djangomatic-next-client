"use client";

// NextUI components
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
    DropdownSection,
    DropdownItem,
} from "@nextui-org/dropdown";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";

// NextJS components
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

// Custom components
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { SearchInput } from "@/components/SearchInput";

export const Navbar = () => {
    // Navbar state
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        // brand definition
        <NextUINavbar
            maxWidth="2xl"
            position="sticky"
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen} 
            isBordered
        >
            <NavbarContent>
                <NavbarBrand
                    as="li"
                    className="gap-3 max-w-fit"
                >
                    <Link
                        className="flex justify-start items-center gap-4"
                        color="foreground"
                        href="/"
                    >
                        <Logo />
                        <p className="font-bold text-inherit">Djangomatic</p>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            {/* navbar menu  */}
            <NavbarContent justify="center">

                {/* toggle menu */}
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                    className="md:hidden"
                />

                {/* or list items menu */}
                <ul className="hidden md:flex items-start justify-start gap-16">
                    {siteConfig.navItems.map((item) => (
                        <NavbarItem key={item.href}>
                            <Link
                                color="foreground"
                                underline="hover"
                                href={item.href}
                            >
                                {item.label}
                            </Link>
                        </NavbarItem>
                    ))}
                </ul>
            </NavbarContent>

            {/* avatar menu with theme switch and search */}
            <NavbarContent justify="end">
                <NavbarItem className="hidden md:flex">
                    <SearchInput />
                </NavbarItem>

                <NavbarItem>
                    <ThemeSwitch />
                </NavbarItem>

                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="secondary"
                            name="Demo User"
                            size="sm"
                            // src="https://i.pravatar.cc/150?img=27"
                        />
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Profile Actions"
                        variant="flat"
                    >
                        <DropdownItem
                            key="profile"
                            className="h-14 gap-2"
                        >
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">Demo User</p>
                        </DropdownItem>
                        <DropdownItem key="settings">My Settings</DropdownItem>
                        <DropdownItem
                            key="logout"
                            color="danger"
                        >
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>


            {/* menu definition when toggled */}
            <NavbarMenu>
                <SearchInput alwaysExpanded={true} />
                <div className="mx-4 mt-2 flex flex-col gap-3">
                    {siteConfig.navMenuToggleItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link
                                color="foreground"
                                className="w-full"
                                href={item.href}
                                size="lg"
                                onClick={() => { setIsMenuOpen((prev) => !prev); }}
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </div>
            </NavbarMenu>

        </NextUINavbar>
    );
};
