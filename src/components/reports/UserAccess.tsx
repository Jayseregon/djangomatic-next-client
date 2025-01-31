"use client";

import React, { useEffect, useState } from "react";

import { fetchUserServer } from "@/actions/generic/action";
import { UserSchema } from "@/interfaces/lib";
import { UnAuthorized } from "@/components/auth/unAuthorized";

export default function UserAccessReports({
  email,
  setCanDeleteReports,
  children,
}: {
  email: string;
  setCanDeleteReports: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserSchema | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUserServer(email);

        setUser(data);
        if (data) {
          setCanDeleteReports(data.canDeleteReports);
        }
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
