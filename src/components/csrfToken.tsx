"use client";

import React, { useEffect, useState } from "react";

import { getMiddlewareCsrfToken } from "@/lib/dbRequests";

/**
 * CsrfTokenPage component fetches and displays the CSRF token.
 * It uses the getMiddlewareCsrfToken function to retrieve the token and displays it in the component.
 *
 * @returns {JSX.Element} The rendered CsrfTokenPage component.
 */
export const CsrfTokenPage = (): JSX.Element => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches the CSRF token and updates the state.
     */
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
