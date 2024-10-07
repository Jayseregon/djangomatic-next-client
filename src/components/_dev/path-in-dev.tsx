"use client";

import { usePathname } from "next/navigation";
import { Snippet } from "@nextui-org/snippet";

import { title } from "@/components/primitives";

/**
 * PathInDev component displays a message indicating that the current page is under development.
 * It extracts the app name from the current path and displays it in the message.
 *
 * @returns {JSX.Element} The rendered PathInDev component.
 */
export default function PathInDev(): JSX.Element {
  const currentPath = usePathname();
  const pathSegments = currentPath.split("/");
  const appName = pathSegments[pathSegments.length - 1]
    .replaceAll("_", " ")
    .toUpperCase();

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className={title()}>Upcoming App</h1>

        <div className="py-5" />

        <Snippet hideCopyButton hideSymbol variant="flat">
          <div className="m-3">
            This page is currently under development <br />
            Will host: <br />
            <div className="pt-5 text-xl">{appName}</div>
          </div>
        </Snippet>
      </div>
    </div>
  );
}
