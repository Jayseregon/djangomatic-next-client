"use client";

import { usePathname } from "next/navigation";

import { title } from "@/components/primitives";
import { saasData } from "@/src/config/saasData";

import { AppItem } from "../ui/sidebars";

export const AppPageTitle = ({ client }: { client: keyof typeof saasData }) => {
  const currentPath = usePathname();
  const appData = (saasData[client] as AppItem[]).find(
    (app) => app.href === currentPath,
  );
  const appName = appData?.label;
  const appDesc = appData?.desc;

  return (
    <div className="grid grid-cols-1 gap-5 pb-10">
      <h1 className={title()}>{appName}</h1>
      <h2 className={title({ size: "xs" })}>{appDesc}</h2>
    </div>
  );
};
