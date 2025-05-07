"use client";

import { useEffect, useState, type JSX } from "react";
import { Tabs, Tab } from "@heroui/react";

import { fetchUserServer } from "@/actions/generic/action";
import { UnAuthorized } from "@/components/auth/unAuthorized";
import { UserSchema } from "@/interfaces/lib";

import { UserTable } from "./UserTable";
import { BlobStorage } from "./BlobStorage";

const AdminTabs = ({ sessionEmail }: { sessionEmail: string }): JSX.Element => {
  const [usersCount, setUsersCount] = useState<number>(0);
  const [superUsersCount, setSuperUsersCount] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/prisma-user");
        const data = await response.json();
        const sortedData = data.sort((a: UserSchema, b: UserSchema) => {
          return a.name.localeCompare(b.name);
        });

        const regularUsers = sortedData.filter(
          (user: UserSchema) => !user.isAdmin,
        );

        setUsersCount(regularUsers.length || 0);

        const superUsers = sortedData.filter(
          (user: UserSchema) => user.isAdmin,
        );

        setSuperUsersCount(superUsers.length || 0);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="admin-tabs"
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-foreground",
            tab: "max-w-fit px-0 h-12 mx-auto",
            tabContent: "text-2xl font-bold mb-4",
          }}
          variant="underlined"
        >
          {/* User Permissions Tab */}
          <Tab key="user-perms" title={`User Permissions (${usersCount})`}>
            <UserTable sessionEmail={sessionEmail} />
          </Tab>
          <Tab
            key="superuser-perms"
            title={`Superuser Permissions (${superUsersCount})`}
          >
            <UserTable isAdmin sessionEmail={sessionEmail} />
          </Tab>
          {/* Azure Blobs Storage Tab */}
          <Tab key="blobs" title="Azure Blobs Storage">
            <BlobStorage />
          </Tab>
          {/* Uncomment the following tab to include Videos */}
          {/* <Tab key="videos" title="Videos">
            <VideosGrid />
          </Tab> */}
        </Tabs>
      </div>
    </div>
  );
};

export const UserAccessAdmin = ({ email }: { email: string }): JSX.Element => {
  const [user, setUser] = useState<UserSchema | null>(null);

  useEffect(() => {
    /**
     * Fetches user data based on the provided email.
     */
    async function fetchData() {
      try {
        const data = await fetchUserServer(email);

        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }
    fetchData();
  }, [email]);

  // Check if the user is not an admin
  if (user && !user.isAdmin) {
    return <UnAuthorized />;
  } else {
    return <AdminTabs sessionEmail={email} />;
  }
};
