"use client";

import React, { useEffect, useState } from "react";

import { getMiddlewareCsrfToken } from "@/lib/dbRequests";

interface SchemaDropdownData {
  value: string;
  label: string;
}

export const CsrfTokenPage = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getMiddlewareCsrfToken();

      setCsrfToken(token);
    };

    fetchCsrfToken();
  }, []);

  return (
    <div>
      <h1>CSRF Token</h1>
      <p>{csrfToken ?? "Loading..."}</p>
    </div>
  );
};
