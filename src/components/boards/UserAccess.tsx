"use client";

import { useEffect, useState } from "react";
import { fetchUser, UserSchema } from "@/lib/getUserPermission";
import { UnAuthorized } from "../auth/unAuthorized";

/**
 * UserAccessBoards component checks if a user has access to boards and renders the appropriate content.
 *
 * @param {Object} props - The props for the UserAccessBoards component.
 * @param {string} props.email - The email of the user to check permissions for.
 * @returns {JSX.Element} The rendered UserAccessBoards component.
 */
export const UserAccessBoards = ({ email }: { email: string }): JSX.Element => {
  const [user, setUser] = useState<UserSchema | null>(null);

  useEffect(() => {
    // Fetches user data based on the provided email.
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

  // Check if the user does not have access to boards
  if (user && !user.canAccessBoards) {
    return <UnAuthorized />;
  } else {
    return (
      <div>
        {/* Display the user's board access permission */}
        <div>Permission: {user?.canAccessBoards.toString()}</div>
      </div>
    );
  }
};
