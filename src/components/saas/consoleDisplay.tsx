"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

import { SaveIcon } from "../icons";

import { useConsoleData } from "./inputDataProviders";

/**
 * ConsoleDisplay component to display text data in a console/terminal-like feel.
 *
 * @returns {JSX.Element} The rendered component.
 */
export const ConsoleDisplay = (): JSX.Element => {
  const { consoleOutput } = useConsoleData();
  const consoleRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("consoleDisplay");

  // Scroll to the bottom whenever consoleOutput changes
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  /**
   * Function to download console output as a text file.
   */
  const downloadConsoleLog = () => {
    const element = document.createElement("a");
    const file = new Blob([consoleOutput], { type: "text/plain" });

    element.href = URL.createObjectURL(file);
    element.download = "console_log.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div>
      <div className="relative bg-slate-900 w-[45rem] h-48 rounded-xl mx-auto text-white font-mono border-2 border-primary overflow-hidden">
        <div
          ref={consoleRef}
          className="w-full h-full overflow-y-scroll p-4 text-start tracking-tighter break-all"
        >
          {/* Display each line of the console output */}
          {consoleOutput.split("\n").map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
        <button
          className="absolute top-2 right-2 text-white"
          title="Download Console Log"
          onClick={downloadConsoleLog}
        >
          <SaveIcon />
        </button>
      </div>
      <p className="text-xs italic pt-1">{t("label")}</p>
    </div>
  );
};
