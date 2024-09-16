"use client";

import React, { useEffect, useRef } from "react";

import { useConsoleData } from "./inputDataProviders";

/**
 * ConsoleDisplay component to display text data in a console/terminal-like feel.
 *
 * @returns {JSX.Element} The rendered component.
 */
export const ConsoleDisplay = (): JSX.Element => {
  const { consoleOutput } = useConsoleData();
  const consoleRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever consoleOutput changes
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  return (
    <div>
      <div
        ref={consoleRef}
        className="bg-slate-900 w-[45rem] text-wrap h-48 scroll-smooth rounded-xl mx-auto text-white text-start font-mono tracking-tighter py-2 ps-4 border-2 border-primary overflow-y-scroll text-wrap break-all"
      >
        {consoleOutput.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};
