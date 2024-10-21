"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, Button, RadioGroup, Radio } from "@nextui-org/react";

import { CheckIcon, UncheckIcon } from "@/components/icons";

import { renderTableBody } from "./UserTableBodies";
import { renderTableHeader } from "./UserTableHeaders";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin: Date;
  isAdmin: boolean;
  isUser: boolean;
  canAccessApps: boolean;
  canAccessBoards: boolean;
  canAccessRnd: boolean;
  canAccessReports: boolean;
  canAccessDocs: boolean;
}

interface PermissionSwitchProps {
  user: any;
  fieldName: string;
  borderType?: string;
  handleToggle: (id: string, field: string, value: boolean) => void;
}

const superUserEmails = ["jayseregon@gmail.com", "jeremie.bitsch@telecon.ca"];

/**
 * PermissionButton component renders a button to toggle user permissions.
 * The button's color and icon change based on the user's current permission state.
 *
 * @param {Object} props - The props for the PermissionButton component.
 * @param {User} props.user - The user object containing permission data.
 * @param {string} props.fieldName - The name of the permission field to toggle.
 * @param {Function} props.handleToggle - The function to handle the toggle action.
 * @returns {JSX.Element} The rendered PermissionButton component.
 */
export const PermissionButton = ({
  user,
  fieldName,
  handleToggle,
}: PermissionSwitchProps): JSX.Element => {
  return (
    <Button
      isIconOnly
      className="ps-0.5 pt-0.5"
      color={user[fieldName] ? "success" : "danger"}
      disabled={!superUserEmails.includes(user.email)}
      radius="full"
      size="sm"
      variant="light"
      onClick={() => handleToggle(user.id, fieldName, !user[fieldName])}
    >
      {/* Render the appropriate icon based on the user's permission state */}
      {user[fieldName] ? <CheckIcon size={24} /> : <UncheckIcon size={24} />}
    </Button>
  );
};

/**
 * VerticalText component renders a given text vertically.
 * Each character of the text is displayed in a separate line.
 *
 * @param {Object} props - The props for the VerticalText component.
 * @param {string} props.text - The text to be displayed vertically.
 * @returns {JSX.Element} The rendered VerticalText component.
 */
export const VerticalText = ({ text }: { text: string }): JSX.Element => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-2">
      {/* Split the text into individual characters and render each character in a separate line */}
      {text.split("").map((char, index) => (
        <div key={index}>{char}</div>
      ))}
    </div>
  );
};

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
  const [users, setUsers] = useState<User[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<string>("default");
  // If the session email is one of the superuser emails, allow editing own permissions
  // Otherwise, disable editing for superuser emails
  const disabledKeys = superUserEmails.includes(sessionEmail)
    ? undefined
    : superUserEmails;

  useEffect(() => {
    /**
     * Fetches user data from the API and sets the users state.
     */
    async function fetchData() {
      try {
        const response = await fetch("/api/prisma-users");
        const data = await response.json();
        const sortedData = data.sort((a: User, b: User) => {
          return a.name.localeCompare(b.name);
        });
        // const filteredData = sortedData.filter((user: User) => user.isAdmin);
        const filteredData = isAdmin
          ? sortedData.filter((user: User) => user.isAdmin)
          : sortedData.filter((user: User) => !user.isAdmin);

        setUsers(filteredData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
    fetchData();
  }, []);

  /**
   * Handles toggling of user permissions.
   *
   * @param {string} id - The ID of the user.
   * @param {string} field - The permission field to toggle.
   * @param {boolean} value - The new value of the permission field.
   */
  const handleToggle = async (id: string, field: string, value: boolean) => {
    try {
      const response = await fetch("/api/prisma-user-update", {
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
          disabledKeys={disabledKeys}
          selectionMode="single"
          topContent={topContent()}
        >
          {/* Render the appropriate table header based on the selected menu */}
          {renderTableHeader(selectedMenu)}
          <TableBody emptyContent="No entries found" items={users}>
            {(user) => renderTableBody(user, selectedMenu, handleToggle)}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
