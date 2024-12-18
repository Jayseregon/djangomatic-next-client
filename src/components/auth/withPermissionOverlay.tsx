"use client";

import React, { useEffect, useState, type JSX } from "react";
import { useTranslations } from "next-intl";

import { fetchUser } from "@/lib/getUserPermission";
import { UserSchema } from "@/interfaces/lib";

interface WithPermissionOverlayProps {
  email: string;
  permission: keyof UserSchema;
  children: React.ReactNode;
}

/**
 * WithPermissionOverlay component checks if a user has the required permission and renders the appropriate content.
 * If the user does not have the required permission, it displays an overlay with an unauthorized message.
 *
 * @param {Object} props - The props for the WithPermissionOverlay component.
 * @param {string} props.email - The email of the user to check permissions for.
 * @param {keyof UserSchema} props.permission - The permission field to check.
 * @param {React.ReactNode} props.children - The children components to render if the user has the required permission.
 * @returns {JSX.Element} The rendered WithPermissionOverlay component.
 */
export const WithPermissionOverlay = ({
  email,
  permission,
  children,
}: WithPermissionOverlayProps): JSX.Element => {
  const [user, setUser] = useState<UserSchema | null>(null);
  const t = useTranslations();

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

  // Check if the user has the required permission
  const hasPermission = user ? user[permission] : false;

  return (
    <div className="relative">
      {/* Render children components if the user has the required permission */}
      <div className={hasPermission ? "" : "pointer-events-none"}>
        {children}
      </div>
      {/* Display an overlay with an unauthorized message if the user does not have the required permission */}
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

/**
 * WithPermissionOverlayDocs component checks if a user has the required permission and renders the appropriate content.
 * If the user does not have the required permission, it displays an overlay with an unauthorized message and blurs the content.
 *
 * @param {Object} props - The props for the WithPermissionOverlayDocs component.
 * @param {string} props.email - The email of the user to check permissions for.
 * @param {keyof UserSchema} props.permission - The permission field to check.
 * @param {React.ReactNode} props.children - The children components to render if the user has the required permission.
 * @returns {JSX.Element} The rendered WithPermissionOverlayDocs component.
 */
export const WithPermissionOverlayDocs = ({
  email,
  permission,
  children,
}: WithPermissionOverlayProps): JSX.Element => {
  const [user, setUser] = useState<UserSchema | null>(null);
  const t = useTranslations();

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

  // Check if the user has the required permission
  const hasPermission = user ? user[permission] : false;

  return (
    <div className="relative">
      {/* Render children components if the user has the required permission */}
      <div className={hasPermission ? "" : "pointer-events-none blur p-4"}>
        {children}
      </div>
      {/* Display an overlay with an unauthorized message if the user does not have the required permission */}
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
