"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, RadioGroup, Radio } from "@nextui-org/react";

import { UserSchema } from "@/interfaces/lib";
import { superUserEmails } from "@/config/superUser";
import { LoadingContent } from "@/components/ui/LoadingContent";

import { renderTableBody } from "./UserTableBodies";
import { renderTableHeader } from "./UserTableHeaders";

/**
 * UserTable component renders a table of users with various permission settings.
 * It allows toggling of user permissions and displays different headers and bodies
 * based on the selected menu.
 *
 * @returns {JSX.Element} The rendered UserTable component.
 */
export const UserTable = ({
  sessionEmail,
  isAdmin = false,
}: {
  sessionEmail: string;
  isAdmin?: boolean;
}): JSX.Element => {
  const [users, setUsers] = useState<UserSchema[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<string>("default");

  // Determine if the session user is a superuser
  const isSessionSuperUser = superUserEmails.includes(sessionEmail);

  useEffect(() => {
    async function fetchData() {
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
        console.error("Failed to fetch users:", error);
      }
    }
    fetchData();
  }, [isAdmin]);

  /**
   * Handles toggling of user permissions.
   *
   * @param {string} id - The ID of the user.
   * @param {string} field - The permission field to toggle.
   * @param {boolean} value - The new value of the permission field.
   */
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

  /**
   * Renders the top content with radio groups for selecting the menu.
   *
   * @returns {JSX.Element} The rendered top content.
   */
  const topContent = (): JSX.Element => {
    return (
      <div className="flex inline-block uppercase text-center gap-4 divide-x divide-zinc-300 dark:divide-zinc-700">
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
          <Radio value="apps-tds">TDS</Radio>
          <Radio value="apps-cogeco">COGECO</Radio>
          <Radio value="apps-vistabeam">Vistabeam</Radio>
          <Radio value="apps-xplore">Xplore</Radio>
          <Radio value="apps-telus">Telus</Radio>
        </RadioGroup>
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
          {/* Render the appropriate table header based on the selected menu */}
          {renderTableHeader(selectedMenu, isAdmin)}
          <TableBody
            emptyContent="No entries found"
            items={users}
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
