"use client";

import { Link } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { UnAuthorized } from "@/components/auth/unAuthorized";

import { UserSchema } from "@/interfaces/lib";
import { linkTagStyling } from "@/components/ui/sidebars/helper";

export const SidebarRnD = ({
  nonce,
  email,
}: {
  nonce?: string;
  email: string;
}): JSX.Element => {
  const [users, setUsers] = useState<UserSchema[]>([]);
  const t = useTranslations("RnD");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/rnd-all-users");
        const data = await response.json();

        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
    fetchUsers();
  }, []);

  const user = users.find((user) => user.email === email);
  if (user && user.canAccessRnd) {
    return (
      <div className="flex flex-col gap-2">
        <div className="section">
          <Accordion
            defaultExpandedKeys={["rnd-team", "rnd-home"]}
            variant="bordered">
            <AccordionItem
              key="rnd-home"
              aria-label="rnd-home"
              title={
                <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                  {t("sidebar.homeSection.title")}
                </h2>
              }>
              <Link
                className={`${linkTagStyling("/rnd", "/rnd")}`}
                href={"/rnd"}
                nonce={nonce}>
                {t("sidebar.homeSection.dashboardLink")}
              </Link>
            </AccordionItem>

            {/* RnD Team Section */}
            <AccordionItem
              key="rnd-team"
              aria-label="rnd-team"
              title={
                <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                  {t("sidebar.teamSection")}
                </h2>
              }>
              <ul>
                {users.map((user) => (
                  <li
                    key={user.id}
                    className="py-1">
                    {/* Render the link for each user */}
                    <Link
                      className={`${linkTagStyling(`/rnd/${user.id}`, `/rnd/${user.id}`)}`}
                      href={`/rnd/${user.id}`}
                      nonce={nonce}>
                      {user.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-2">
        <div className="section">
          <UnAuthorized />
        </div>
      </div>
    );
  }
};
