"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { fetchUser, UserSchema } from "@/lib/getUserPermission";

interface WithPermissionOverlayProps {
  email: string;
  permission: keyof UserSchema;
  children: React.ReactNode;
}

export const WithPermissionOverlay = ({
  email,
  permission,
  children,
}: WithPermissionOverlayProps) => {
  const [user, setUser] = useState<UserSchema | null>(null);
  const t = useTranslations();

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

  const hasPermission = user ? user[permission] : false;

  return (
    <div className="relative">
      <div className={hasPermission ? "" : "pointer-events-none"}>
        {children}
      </div>
      {!hasPermission && (
        <div className="absolute inset-0 rounded-xl bg-background bg-opacity-70 z-10 pointer-events-auto">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-danger p-5 rounded-xl max-w-sm border-2 border-danger">
            {t("UnAuthorized.interact")}
          </div>
        </div>
      )}
    </div>
  );
};

export const WithPermissionOverlayDocs = ({
  email,
  permission,
  children,
}: WithPermissionOverlayProps) => {
  const [user, setUser] = useState<UserSchema | null>(null);
  const t = useTranslations();

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

  const hasPermission = user ? user[permission] : false;

  return (
    <div className="relative">
      <div className={hasPermission ? "" : "pointer-events-none blur p-4"}>
        {children}
      </div>
      {!hasPermission && (
        <div className="absolute inset-0 rounded-xl bg-background bg-opacity-80 z-10 pointer-events-auto">
          <div className="fixed top-1/2 left-2/3 transform -translate-x-2/3 -translate-y-1/2 bg-black bg-opacity-70 text-danger p-5 rounded-xl max-w-sm border-2 border-danger">
            {t("UnAuthorized.interact")}
          </div>
        </div>
      )}
    </div>
  );
};
