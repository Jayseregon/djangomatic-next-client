"use client";

import React, { useEffect, useState } from "react";

import { fetchUser, UserSchema } from "@/lib/getUserPermission";

import { UnAuthorized } from "../auth/unAuthorized";

export default function UserAccessReports({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
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

  // Check if the user is not an admin
  if (user && !user.canAccessReports) {
    return <UnAuthorized />;
  } else {
    return <>{children}</>;
  }
}
