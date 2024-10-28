"use client";

import { useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";

import { fetchUser } from "@/lib/getUserPermission";
import { UnAuthorized } from "@/components/auth/unAuthorized";
import { UserSchema } from "@/interfaces/lib";

import { UserTable } from "./UserTable";
import { BlobStorage } from "./BlobStorage";
// import { VideosGrid } from "./VideosGrid";

/**
 * AdminTabs component renders a set of tabs for administrative tasks.
 * It includes tabs for user permissions and Azure blobs storage.
 *
 * @returns {JSX.Element} The rendered AdminTabs component.
 */
const AdminTabs = ({ sessionEmail }: { sessionEmail: string }): JSX.Element => {
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
          <Tab key="user-perms" title="User Permissions">
            <UserTable sessionEmail={sessionEmail} />
          </Tab>
          <Tab key="superuser-perms" title="Superuser Permissions">
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

/**
 * UserAccessAdmin component checks if a user has admin access and renders the appropriate content.
 * If the user is not an admin, it displays an unauthorized message.
 * If the user is an admin, it renders the AdminTabs component.
 *
 * @param {Object} props - The props for the UserAccessAdmin component.
 * @param {string} props.email - The email of the user to check permissions for.
 * @returns {JSX.Element} The rendered UserAccessAdmin component.
 */
export const UserAccessAdmin = ({ email }: { email: string }): JSX.Element => {
  const [user, setUser] = useState<UserSchema | null>(null);

  useEffect(() => {
    /**
     * Fetches user data based on the provided email.
     */
    async function fetchData() {
      try {
        const data = await fetchUser(email);

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
