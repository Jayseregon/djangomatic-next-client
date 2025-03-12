"use client";

import React, { useEffect, useState, type JSX } from "react";

import { fetchUserServer } from "@/actions/generic/action";
import { UserSchema } from "@/interfaces/lib";
import { UnAuthorized } from "@/components/auth/unAuthorized";

export function UserAccessChatbot({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<UserSchema | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUserServer(email);

        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }
    fetchData();
  }, [email]);

  if (user && !user.canAccessChatbot) {
    return <UnAuthorized />;
  } else {
    return <>{children}</>;
  }
}
