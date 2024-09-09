"use client";

import { useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";

import { fetchUser, UserSchema } from "@/lib/getUserPermission";

import { UnAuthorized } from "../unAuthorized";

import { UserTable } from "./UserTable";
import { BlobStorage } from "./BlobStorage";
import { VideosGrid } from "./VideosGrid";

const AdminTabs = () => {
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
          <Tab key="perms" title="User Permissions">
            <UserTable />
          </Tab>
          <Tab key="blobs" title="Azure Blobs Storage">
            <BlobStorage />
          </Tab>
          <Tab key="videos" title="Videos">
            <VideosGrid />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export const UserAccessAdmin = ({ email }: { email: string }) => {
  const [user, setUser] = useState<UserSchema | null>(null);

  useEffect(() => {
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

  if (user && !user.isAdmin) {
    return <UnAuthorized />;
  } else {
    return (
      <div>
        <AdminTabs />
      </div>
    );
  }
};
