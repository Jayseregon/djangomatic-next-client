"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  RadioGroup,
  Radio,
} from "@nextui-org/react";

import { CheckIcon, UncheckIcon } from "@/components/icons";

interface User {
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
export const VerticalText = ({ text }: { text: string }) => {
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
export const UserTable = (): JSX.Element => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<string>("default");

  useEffect(() => {
    /**
     * Fetches user data from the API and sets the users state.
     */
    async function fetchData() {
      try {
        const response = await fetch("/api/prisma-users");
        const data = await response.json();

        setUsers(data);
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

  /**
   * Renders the default table header.
   *
   * @returns {JSX.Element} The rendered default table header.
   */
  const defaultHeader = (): JSX.Element => {
    return (
      <TableHeader>
        <TableColumn key="email" className="w-56">
          email
        </TableColumn>
        <TableColumn key="username" className="w-56">
          username
        </TableColumn>
        <TableColumn key="log" className="w-56">
          last login
        </TableColumn>
        <TableColumn key="admin">admin</TableColumn>
        <TableColumn key="boards">boards</TableColumn>
        <TableColumn key="rnd">r&amp;d</TableColumn>
        <TableColumn key="reports">reports</TableColumn>
      </TableHeader>
    );
  };

  /**
   * Renders the default table body.
   *
   * @param {Object} params - The parameters for the default table body.
   * @param {User} params.user - The user object.
   * @returns {JSX.Element} The rendered default table body.
   */
  const defaultBody = ({ user }: { user: User }): JSX.Element => {
    return (
      <TableRow key={user.id}>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
        <TableCell>
          <PermissionButton
            fieldName="isAdmin"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessBoards"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessRnd"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessReports"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
      </TableRow>
    );
  };

  /**
   * Renders the docs table header.
   *
   * @returns {JSX.Element} The rendered docs table header.
   */
  const docsHeader = (): JSX.Element => {
    return (
      <TableHeader>
        <TableColumn key="email" className="w-56">
          email
        </TableColumn>
        <TableColumn key="username" className="w-56">
          username
        </TableColumn>
        <TableColumn key="docs1">tds</TableColumn>
        <TableColumn key="docs2">cogeco</TableColumn>
        <TableColumn key="docs3">vistabeam</TableColumn>
        <TableColumn key="docs4">xplore</TableColumn>
      </TableHeader>
    );
  };

  /**
   * Renders the docs table body.
   *
   * @param {Object} params - The parameters for the docs table body.
   * @param {User} params.user - The user object.
   * @returns {JSX.Element} The rendered docs table body.
   */
  const docsBody = ({ user }: { user: User }): JSX.Element => {
    return (
      <TableRow key={user.id}>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessDocsTDS"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessDocsCogeco"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessDocsVistabeam"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessDocsXplore"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
      </TableRow>
    );
  };

  /**
   * Renders the videos table header.
   *
   * @returns {JSX.Element} The rendered videos table header.
   */
  const videosHeader = (): JSX.Element => {
    return (
      <TableHeader>
        <TableColumn key="email" className="w-56">
          email
        </TableColumn>
        <TableColumn key="username" className="w-56">
          username
        </TableColumn>
        <TableColumn key="videos1">default</TableColumn>
        <TableColumn key="videos2">qgis</TableColumn>
        <TableColumn key="videos3">sttar</TableColumn>
      </TableHeader>
    );
  };

  /**
   * Renders the videos table body.
   *
   * @param {Object} params - The parameters for the videos table body.
   * @param {User} params.user - The user object.
   * @returns {JSX.Element} The rendered videos table body.
   */
  const videosBody = ({ user }: { user: User }): JSX.Element => {
    return (
      <TableRow key={user.id}>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessVideoDefault"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessVideoQGIS"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessVideoSttar"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
      </TableRow>
    );
  };

  /**
   * Renders the apps TDS table header.
   *
   * @returns {JSX.Element} The rendered apps TDS table header.
   */
  const appsTdsHeader = (): JSX.Element => {
    return (
      <TableHeader>
        <TableColumn key="email" className="w-56">
          email
        </TableColumn>
        <TableColumn key="username" className="w-56">
          username
        </TableColumn>
        <TableColumn key="tds1">hld</TableColumn>
        <TableColumn key="tds2">lld</TableColumn>
        <TableColumn key="tds3">arcgis</TableColumn>
        <TableColumn key="tds4">ovr</TableColumn>
        <TableColumn key="tds5">admin</TableColumn>
        <TableColumn key="tds6">super</TableColumn>
      </TableHeader>
    );
  };

  /**
   * Renders the apps TDS table body.
   *
   * @param {Object} params - The parameters for the apps TDS table body.
   * @param {User} params.user - The user object.
   * @returns {JSX.Element} The rendered apps TDS table body.
   */
  const appsTdsBody = ({ user }: { user: User }): JSX.Element => {
    return (
      <TableRow key={user.id}>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessAppsTdsHLD"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessAppsTdsLLD"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessAppsTdsArcGIS"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessAppsTdsOverride"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessAppsTdsAdmin"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessAppsTdsSuper"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
      </TableRow>
    );
  };

  /**
   * Renders the apps COGECO table header.
   *
   * @returns {JSX.Element} The rendered apps COGECO table header.
   */
  const appsCogecoHeader = (): JSX.Element => {
    return (
      <TableHeader>
        <TableColumn key="email" className="w-56">
          email
        </TableColumn>
        <TableColumn key="username" className="w-56">
          username
        </TableColumn>
        <TableColumn key="cog1">hld</TableColumn>
      </TableHeader>
    );
  };

  /**
   * Renders the apps COGECO table body.
   *
   * @param {Object} params - The parameters for the apps COGECO table body.
   * @param {User} params.user - The user object.
   * @returns {JSX.Element} The rendered apps COGECO table body.
   */
  const appsCogecoBody = ({ user }: { user: User }): JSX.Element => {
    return (
      <TableRow key={user.id}>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessAppsCogecoHLD"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
      </TableRow>
    );
  };

  /**
   * Renders the apps Vistabeam table header.
   *
   * @returns {JSX.Element} The rendered apps Vistabeam table header.
   */
  const appsVistabeamHeader = (): JSX.Element => {
    return (
      <TableHeader>
        <TableColumn key="email" className="w-56">
          email
        </TableColumn>
        <TableColumn key="username" className="w-56">
          username
        </TableColumn>
        <TableColumn key="vista1">hld</TableColumn>
        <TableColumn key="vista2">ovr</TableColumn>
        <TableColumn key="vista3">super</TableColumn>
      </TableHeader>
    );
  };

  /**
   * Renders the apps Vistabeam table body.
   *
   * @param {Object} params - The parameters for the apps Vistabeam table body.
   * @param {User} params.user - The user object.
   * @returns {JSX.Element} The rendered apps Vistabeam table body.
   */
  const appsVistabeamBody = ({ user }: { user: User }): JSX.Element => {
    return (
      <TableRow key={user.id}>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessAppsVistabeamHLD"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessAppsVistabeamOverride"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessAppsVistabeamSuper"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
      </TableRow>
    );
  };

  /**
   * Renders the apps Xplore table header.
   *
   * @returns {JSX.Element} The rendered apps Xplore table header.
   */
  const appsXploreHeader = (): JSX.Element => {
    return (
      <TableHeader>
        <TableColumn key="email" className="w-56">
          email
        </TableColumn>
        <TableColumn key="username" className="w-56">
          username
        </TableColumn>
        <TableColumn key="xplore1">admin</TableColumn>
      </TableHeader>
    );
  };

  /**
   * Renders the apps Xplore table body.
   *
   * @param {Object} params - The parameters for the apps Xplore table body.
   * @param {User} params.user - The user object.
   * @returns {JSX.Element} The rendered apps Xplore table body.
   */
  const appsXploreBody = ({ user }: { user: User }): JSX.Element => {
    return (
      <TableRow key={user.id}>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>
          <PermissionButton
            fieldName="canAccessAppsXploreAdmin"
            handleToggle={handleToggle}
            user={user}
          />
        </TableCell>
      </TableRow>
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
          {selectedMenu === "default"
            ? defaultHeader()
            : selectedMenu === "docs"
              ? docsHeader()
              : selectedMenu === "videos"
                ? videosHeader()
                : selectedMenu === "apps-tds"
                  ? appsTdsHeader()
                  : selectedMenu === "apps-cogeco"
                    ? appsCogecoHeader()
                    : selectedMenu === "apps-vistabeam"
                      ? appsVistabeamHeader()
                      : appsXploreHeader()}
          <TableBody emptyContent="No entries found" items={users}>
            {(user) =>
              // Render the appropriate table body based on the selected menu
              selectedMenu === "default"
                ? defaultBody({ user })
                : selectedMenu === "docs"
                  ? docsBody({ user })
                  : selectedMenu === "videos"
                    ? videosBody({ user })
                    : selectedMenu === "apps-tds"
                      ? appsTdsBody({ user })
                      : selectedMenu === "apps-cogeco"
                        ? appsCogecoBody({ user })
                        : selectedMenu === "apps-vistabeam"
                          ? appsVistabeamBody({ user })
                          : appsXploreBody({ user })
            }
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
