"use client";

import React, { useEffect, useState } from "react";

import { fetchUser } from "@/lib/getUserPermission";
import { UserSchema } from "@/interfaces/lib";
import { UnAuthorized } from "@/components/auth/unAuthorized";

import { TaskManager } from "./TaskManager";

/**
 * UserAccessRnD component checks if a user has access to R&D and renders the appropriate content.
 * If the user does not have R&D access, it displays an unauthorized message.
 * If the user has R&D access, it displays the user's R&D access permission.
 *
 * @param {Object} props - The props for the UserAccessRnD component.
 * @param {string} props.email - The email of the user to check permissions for.
 * @returns {JSX.Element} The rendered UserAccessRnD component.
 */
export function UserAccessRnD({ email }: { email: string }): JSX.Element {
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
    return <UsersTasksBoards />;
  }
}

const UsersTasksBoards = () => {
  const [users, setUsers] = useState<UserSchema[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/rnd-all-users");
        const data = await response.json();

        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-2 space-x-5 space-y-10 w-full">
      {users.map((user) => (
        <TaskManager key={user.id} user={user} />
      ))}
    </div>
  );
};
