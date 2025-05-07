"use client";

import { Link } from "@heroui/react";
import React, { useEffect, useState, type JSX } from "react";
import { useTranslations } from "next-intl";
import { Accordion, AccordionItem } from "@heroui/react";

import { UnAuthorized } from "@/components/auth/unAuthorized";
import { UserSchema } from "@/interfaces/lib";
import { linkTagStyling } from "@/components/ui/sidebars/helper";
import { BugReport } from "@/interfaces/bugs";
import { getRndUsers } from "@/src/actions/prisma/rndTask/action";

export const SidebarRnD = ({
  nonce,
  email,
}: {
  nonce?: string;
  email: string;
}): JSX.Element => {
  const [users, setUsers] = useState<UserSchema[]>([]);
  const [bugCount, setBugCount] = useState<number>(0);
  const t = useTranslations("RnD");

  useEffect(() => {
    async function fetchData() {
      try {
        const dataUsers = await getRndUsers();

        setUsers(dataUsers);

        const resBugs = await fetch("/api/bug-report");
        const dataBugs = await resBugs.json();
        const filteredBugs = dataBugs.filter(
          (bug: BugReport) => !bug.completedDate,
        );
        const count = filteredBugs.length;

        setBugCount(count);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
    fetchData();
  }, []);

  const user = users.find((user) => user.email === email);

  if (user && user.canAccessRnd) {
    return (
      <div className="flex flex-col gap-2">
        <div className="section">
          <Accordion
            defaultExpandedKeys={[
              "rnd-team",
              "rnd-home",
              "bug-report",
              "chatbot-tools",
            ]}
            variant="bordered"
          >
            <AccordionItem
              key="rnd-home"
              aria-label="rnd-home"
              title={
                <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                  {t("sidebar.homeSection.title")}
                </h2>
              }
            >
              <Link
                className={`${linkTagStyling("/rnd", "/rnd")}`}
                href={"/rnd"}
                nonce={nonce}
              >
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
              }
            >
              <ul>
                {users.map((user) => (
                  <li key={user.id} className="py-1">
                    {/* Render the link for each user */}
                    <Link
                      className={`${linkTagStyling(`/rnd/${user.id}`, `/rnd/${user.id}`)}`}
                      href={`/rnd/${user.id}`}
                      nonce={nonce}
                    >
                      {user.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionItem>

            {/* RnD Reports access */}
            <AccordionItem
              key="bug-report"
              aria-label="bug-report"
              title={
                <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                  {t("sidebar.reportsSection.title")}
                </h2>
              }
            >
              {/* Bug reports access */}
              <Link
                className={`${linkTagStyling("/rnd/bugs", "/rnd/bugs")} w-full`}
                href={"/rnd/bugs"}
                nonce={nonce}
              >
                <div className="flex w-full justify-between">
                  {t("sidebar.reportsSection.bugDashboardLink")}
                  <div
                    className={`flex items-center justify-center ps-1 pe-3 font-bold text-background ${bugCount !== 0 ? "bg-red-500" : "bg-green-500"} rounded-full`}
                  >
                    {bugCount}
                  </div>
                </div>
              </Link>

              {/* Tracking access */}
              <Link
                className={`${linkTagStyling("/rnd/tracking/apps", "/rnd/tracking/apps")} w-full`}
                href={"/rnd/tracking/apps"}
                nonce={nonce}
              >
                {t("sidebar.reportsSection.appTrackingLink")}
              </Link>
              <Link
                className={`${linkTagStyling("/rnd/tracking/gains", "/rnd/tracking/gains")} w-full`}
                href={"/rnd/tracking/gains"}
                nonce={nonce}
              >
                {t("sidebar.reportsSection.gainsTrackingLink")}
              </Link>
              <Link
                className={`${linkTagStyling("/rnd/tracking/chat", "/rnd/tracking/chat")} w-full`}
                href={"/rnd/tracking/chat"}
                nonce={nonce}
              >
                {t("sidebar.reportsSection.chatbotTrackingLink")}
              </Link>
            </AccordionItem>

            {/* AI Chatbot tools */}
            <AccordionItem
              key="chatbot-tools"
              aria-label="chatbot-tools"
              title={
                <h2 className="text-xl font-black text-foreground indent-2 mt-3 mb-1">
                  Chatbot Tools
                </h2>
              }
            >
              <Link
                className={`${linkTagStyling("/rnd/chatbot-tools/health-check", "/rnd/chatbot-tools/health-check")} w-full`}
                href={"/rnd/chatbot-tools/health-check"}
                nonce={nonce}
              >
                Health Check
              </Link>
              <Link
                className={`${linkTagStyling("/rnd/chatbot-tools/sources", "/rnd/chatbot-tools/sources")} w-full`}
                href={"/rnd/chatbot-tools/sources"}
                nonce={nonce}
              >
                Sources Management
              </Link>
              <Link
                className={`${linkTagStyling("/rnd/chatbot-tools/uploads", "/rnd/chatbot-tools/uploads")} w-full`}
                href={"/rnd/chatbot-tools/uploads"}
                nonce={nonce}
              >
                Uploads Management
              </Link>
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
