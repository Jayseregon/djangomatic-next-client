"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { title } from "@/components/primitives";
import { saasData } from "@/src/config/saasData";
import { useAppName, useInputData } from "./inputDataProviders";
import { AppItem } from "../ui/sidebars";
import { InputDataProps } from "./serverDropdowns";

/**
 * AppPageTitle component automatically detects and displays the app name.
 * It also sets the app name and task endpoint in the input data context.
 *
 * @param {Object} props - The props for the AppPageTitle component.
 * @param {keyof typeof saasData} props.client - The client key to access the saasData.
 * @returns {JSX.Element} The rendered AppPageTitle component.
 */
export const AppPageTitle = ({
  client,
}: {
  client: keyof typeof saasData;
}): JSX.Element => {
  const currentPath = usePathname();
  const { setAppName } = useAppName();
  const { setInputData } = useInputData();

  // Find the app data based on the current path
  const appData = (saasData[client] as AppItem[]).find(
    (app) => app.href === currentPath
  );
  const appName = appData?.label;
  const endpoint = appData?.endpoint;
  const asDownloadable = appData?.asDownloadable;
  const dbClass = appData?.dbClass;
  const appType = appData?.type

  useEffect(() => {
    // Set the app name and task endpoint in the input data context
    setAppName(appName || "");
    setInputData((prevDataChoices: InputDataProps) => ({
      ...prevDataChoices,
      taskEndpoint: endpoint || "",
      asDownloadable: asDownloadable,
      dbClass: dbClass || "",
      appType: appType || "",
    }));
  }, [appName, setAppName]);

  return (
    <div className="grid grid-cols-1 gap-5 pb-10">
      {/* Display the app name */}
      <h1 className={title()}>{appName}</h1>
    </div>
  );
};
