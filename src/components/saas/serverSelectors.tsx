"use client";

import React from "react";

import { useInputData } from "./inputDataProviders";
import {
  DatabaseDropdown,
  SchemasDropdown,
  TablesDropdown,
  DisplayFieldGuideline,
} from "./serverDropdowns";

type AppType = "hld" | "lld" | "snap" | "admin" | "";

interface DatabaseSchemaTable3SelectorProps {
  appType: AppType;
  pattern: string;
  dbClass: string;
}

interface DatabaseSchema2SelectorProps {
  appType: AppType;
  dbClass: string;
}

/**
 * Component for selecting a database, schema, and table.
 *
 * @param {DatabaseSchemaTable3SelectorProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const DatabaseSchemaTable3Selector = ({
  appType,
  pattern,
  dbClass,
}: DatabaseSchemaTable3SelectorProps): JSX.Element => {
  const { inputData, setInputData } = useInputData();

  return (
    <div className="grid grid-cols-2 gap-8 pt-3 pb-8">
      <div className="grid grid-rows-3 gap-3">
        <DisplayFieldGuideline guideline="Select a database." />
        <DisplayFieldGuideline guideline="Select a schema." />
        <DisplayFieldGuideline guideline="Select a table." />
      </div>
      <div className="grid grid-rows-3 gap-3">
        <DatabaseDropdown
          appType={appType}
          dbClass={dbClass}
          setInputData={setInputData}
        />
        <SchemasDropdown inputData={inputData} setInputData={setInputData} />
        <TablesDropdown
          inputData={inputData}
          pattern={pattern}
          setInputData={setInputData}
        />
      </div>
    </div>
  );
};

/**
 * Component for selecting a database and schema.
 *
 * @param {DatabaseSchema2SelectorProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const DatabaseSchema2Selector = ({
  appType,
  dbClass,
}: DatabaseSchema2SelectorProps): JSX.Element => {
  const { inputData, setInputData } = useInputData();

  return (
    <div className="grid grid-cols-2 gap-8 pt-3 pb-8">
      <div className="grid grid-rows-2 gap-3">
        <DisplayFieldGuideline guideline="Select a database." />
        <DisplayFieldGuideline guideline="Select a schema." />
      </div>
      <div className="grid grid-rows-2 gap-3">
        <DatabaseDropdown
          appType={appType}
          dbClass={dbClass}
          setInputData={setInputData}
        />
        <SchemasDropdown inputData={inputData} setInputData={setInputData} />
      </div>
    </div>
  );
};
