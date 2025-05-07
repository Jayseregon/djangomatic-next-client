"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  type JSX,
} from "react";
import { Table, TableBody, RadioGroup, Radio, Input } from "@heroui/react";

import { UserSchema } from "@/interfaces/lib";
import { superUserEmails } from "@/config/superUser";
import { LoadingContent } from "@/components/ui/LoadingContent";
import { SearchIcon } from "@/components/icons";

import { renderTableBody } from "./UserTableBodies";
import { renderTableHeader } from "./UserTableHeaders";

export const UserTable = ({
  sessionEmail,
  isAdmin = false,
}: {
  sessionEmail: string;
  isAdmin?: boolean;
}): JSX.Element => {
  const [users, setUsers] = useState<UserSchema[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<string>("default");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Determine if the session user is a superuser
  const isSessionSuperUser = superUserEmails.includes(sessionEmail);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true); // Set loading to true before fetch
      try {
        const response = await fetch("/api/prisma-user");
        const data = await response.json();
        const sortedData = data.sort((a: UserSchema, b: UserSchema) => {
          return a.name.localeCompare(b.name);
        });
        const filteredData = isAdmin
          ? sortedData.filter((user: UserSchema) => user.isAdmin)
          : sortedData.filter((user: UserSchema) => !user.isAdmin);

        setUsers(filteredData);
      } catch (error) {
        // Log the error but don't throw it
        console.error("Failed to fetch users:", error);
        setUsers([]);
      } finally {
        setIsLoading(false); // Always set loading to false after fetch
      }
    }
    fetchData();
  }, [isAdmin]);

  const handleToggle = async (id: string, field: string, value: boolean) => {
    try {
      const response = await fetch("/api/prisma-user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          [field]: value,
        }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, [field]: value } : user,
          ),
        );
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Clear search input
  const onClear = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    const lowerSearchTerm = searchTerm.toLowerCase();

    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(lowerSearchTerm) ||
        user.name.toLowerCase().includes(lowerSearchTerm),
    );
  }, [users, searchTerm]);

  const topContent = (): JSX.Element => {
    return (
      <div className="flex flex-col gap-4">
        <Input
          isClearable
          aria-label="Search users"
          className="w-full max-w-xs mb-2"
          classNames={{
            input:
              "text-sm text-foreground border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0",
            inputWrapper: "bg-background border border-foreground",
          }}
          color="default"
          placeholder="Search by email or username..."
          radius="sm"
          startContent={
            <SearchIcon className="text-base text-foreground-400 pointer-events-none flex-shrink-0" />
          }
          value={searchTerm}
          onClear={onClear}
          onValueChange={handleSearchChange}
        />
        <div className="flex uppercase text-center gap-4 divide-x divide-zinc-300 dark:divide-zinc-700">
          <RadioGroup
            aria-label="default-menu"
            label="Default permissions"
            orientation="horizontal"
            value={selectedMenu}
            onValueChange={setSelectedMenu}
          >
            <Radio value="default">Default</Radio>
            <Radio value="docs">Docs</Radio>
            <Radio value="videos">Videos</Radio>
            <Radio value="reports">Reports</Radio>
          </RadioGroup>
          <RadioGroup
            aria-label="apps-menu"
            className="ps-3.5"
            label="Apps permissions"
            orientation="horizontal"
            value={selectedMenu}
            onValueChange={setSelectedMenu}
          >
            <Radio value="apps-global">Global</Radio>
            <Radio value="apps-cogeco">COGECO</Radio>
            <Radio value="apps-tds">TDS</Radio>
            <Radio value="apps-telus">Telus</Radio>
            <Radio value="apps-vistabeam">Vistabeam</Radio>
            <Radio value="apps-xplore">Xplore</Radio>
          </RadioGroup>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-10 w-full">
      <div className="overflow-x-auto">
        <Table
          isHeaderSticky
          removeWrapper
          aria-label="user-perms-table"
          classNames={{
            base: "text-left",
            th: "uppercase bg-foreground text-background",
          }}
          color="primary"
          selectionMode="single"
          topContent={topContent()}
        >
          {renderTableHeader(selectedMenu, isAdmin)}
          <TableBody
            emptyContent="No users found"
            isLoading={isLoading}
            items={filteredUsers}
            loadingContent={<LoadingContent />}
          >
            {(user) =>
              renderTableBody(
                user,
                selectedMenu,
                isAdmin,
                isSessionSuperUser,
                handleToggle,
              )
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
