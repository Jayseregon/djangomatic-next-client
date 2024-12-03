"use client";

import React, { useState } from "react";

import { title } from "@/src/components/primitives";

import { TowerReportsDashboard } from "./TowerReportsDashboard";
import UserAccessReports from "./UserAccess";

export const DashboardManager = ({ email }: { email: string }) => {
  const [canDeleteReports, setCanDeleteReports] = useState(false);

  return (
    <UserAccessReports email={email} setCanDeleteReports={setCanDeleteReports}>
      <div className="mx-auto space-y-16">
        <h1 className={title()}>PCI Reports</h1>
        <TowerReportsDashboard canDeleteReports={canDeleteReports} />
      </div>
    </UserAccessReports>
  );
};
