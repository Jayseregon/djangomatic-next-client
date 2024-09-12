"use client";

import { useEffect, useState } from "react";
import { fetchUser, UserSchema } from "@/lib/getUserPermission";
import { UnAuthorized } from "../auth/unAuthorized";

/**
 * UserAccessRnD component checks if a user has access to R&D and renders the appropriate content.
 * If the user does not have R&D access, it displays an unauthorized message.
 * If the user has R&D access, it displays the user's R&D access permission.
 *
 * @param {Object} props - The props for the UserAccessRnD component.
 * @param {string} props.email - The email of the user to check permissions for.
 * @returns {JSX.Element} The rendered UserAccessRnD component.
 */
export const UserAccessRnD = ({ email }: { email: string }): JSX.Element => {
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

  // Check if the user does not have R&D access
  if (user && !user.canAccessRnd) {
    return <UnAuthorized />;
  } else {
    return (
      <div>
        {/* Display the user's R&D access permission */}
        <div>Permission: {user?.canAccessRnd.toString()}</div>
      </div>
    );
  }
};
