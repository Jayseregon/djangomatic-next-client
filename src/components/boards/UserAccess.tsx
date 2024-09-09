"use client";

import { useEffect, useState } from "react";

import { fetchUser, UserSchema } from "@/lib/getUserPermission";

import { UnAuthorized } from "../unAuthorized";

export const UserAccessBoards = ({ email }: { email: string }) => {
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

  if (user && !user.canAccessBoards) {
    return <UnAuthorized />;
  } else {
    return (
      <div>
        <div>Permission: {user?.canAccessBoards.toString()}</div>
      </div>
    );
  }
};
