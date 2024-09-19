"use client";

import React, { ChangeEvent, useState, MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { useInputData } from "./inputDataProviders";
import { InputDataProps } from "./serverDropdowns";
import { Button } from "@nextui-org/react";
import { ThumbsUpIcon, ThumbsDownIcon } from "../icons";
import {
  DatabaseDropdown,
  SchemasDropdown,
  TablesDropdown,
  DisplayFieldGuideline,
} from "./serverDropdowns";

type AppType = "hld" | "lld" | "snap" | "admin" | "";

/**
 * Props for the DatabaseSchemaTable3Selector component.
 */
interface DatabaseSchemaTable3SelectorProps {
  appType?: AppType;
  pattern: string;
  tableDescription: string;
  endpoint?: string;
}

interface DatabaseSchema2SelectorProps {
  appType?: AppType;
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
  tableDescription,
  endpoint,
}: DatabaseSchemaTable3SelectorProps): JSX.Element => {
  const { inputData, setInputData } = useInputData();
  const t = useTranslations("appDropdownHelper");

  return (
    <div className="grid grid-cols-2 gap-8 pt-3 pb-8">
      <div className="grid grid-rows-3 gap-3">
        {/* Display guidelines for database, schema, and table */}
        <DisplayFieldGuideline guideline={t("database")} />
        <DisplayFieldGuideline guideline={t("schema")} />
        <DisplayFieldGuideline guideline={t(`${tableDescription}`)} />
      </div>
      <div className="grid grid-rows-3 gap-3">
        {/* Dropdown for selecting a database */}
        <DatabaseDropdown
          appType={appType || inputData.appType}
          dbClass={inputData.dbClass}
          setInputData={setInputData}
        />
        {/* Dropdown for selecting a schema */}
        <SchemasDropdown
          inputData={inputData}
          setInputData={setInputData}
        />
        {/* Dropdown for selecting a table */}
        <TablesDropdown
          inputData={inputData}
          pattern={pattern}
          setInputData={setInputData}
          endpoint={endpoint}
        />
      </div>
    </div>
  );
};

/**
 * Component for selecting a database and schema.
 *
 * @returns {JSX.Element} The rendered component.
 */
export const DatabaseSchema2Selector = ({
  appType,
}: DatabaseSchema2SelectorProps): JSX.Element => {
  const { inputData, setInputData } = useInputData();
  const t = useTranslations("appDropdownHelper");

  return (
    <div className="grid grid-cols-2 gap-8 pt-3 pb-8">
      <div className="grid grid-rows-2 gap-3">
        {/* Display guidelines for database and schema */}
        <DisplayFieldGuideline guideline={t("database")} />
        <DisplayFieldGuideline guideline={t("schema")} />
      </div>
      <div className="grid grid-rows-2 gap-3">
        {/* Dropdown for selecting a database */}
        <DatabaseDropdown
          appType={appType || inputData.appType}
          dbClass={inputData.dbClass}
          setInputData={setInputData}
        />
        {/* Dropdown for selecting a schema */}
        <SchemasDropdown
          inputData={inputData}
          setInputData={setInputData}
        />
      </div>
    </div>
  );
};

/**
 * Component for file input button.
 *
 * @returns {JSX.Element} The rendered component.
 */
export const FileInputButton = (): JSX.Element => {
  const t = useTranslations("ServerDropdowns");
  const { setInputData } = useInputData();
  const [fileName, setFileName] = useState<string | null>(null);

  /**
   * Handle file input change event.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setInputData((prevDataChoices: InputDataProps) => ({
        ...prevDataChoices,
        file: file,
        fileName: file.name,
      }));
    } else {
      throw new Error("No file selected.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <DisplayFieldGuideline guideline={t("zipFile.helperText")} />
      <div className="flex w-full inline-block rounded-3xl bg-transparent border-0 text-sm text-white ring-1 ring-inset ring-primary">
        <label
          className="flex items-center justify-center w-20 h-10 bg-primary text-sm text-white text-center rounded-l-3xl ps-2"
          htmlFor="file-input">
          <span>{t("zipFile.label")}</span>
          <input
            aria-label="file-input"
            className="sr-only"
            id="file-input"
            name="file-input"
            type="file"
            accept=".zip"
            onChange={handleFileChange}
          />
        </label>
        {fileName && (
          <span className="ms-3 text-sm text-foreground flex items-center">
            {fileName}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Component for inputting ArcGIS credentials.
 *
 * @returns {JSX.Element} The rendered component.
 */
export const InputArcGISCreds = (): JSX.Element => {
  const t = useTranslations("appDropdownHelper");
  const { setInputData } = useInputData();

  /**
   * Handle input blur event.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The blur event.
   */
  const handleInputBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "username") {
      setInputData((prevDataChoices: InputDataProps) => ({
        ...prevDataChoices,
        tdsUsername: value,
      }));
    } else if (name === "password") {
      setInputData((prevDataChoices: InputDataProps) => ({
        ...prevDataChoices,
        tdsPassword: value,
      }));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 pb-5">
      <div className="grid grid-cols-1 gap-1">
        <p>{t("input_username")}</p>
        <div className="border-2 border-primary rounded-3xl w-full flex items-center justify-center">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="freddie_mercury"
            className="border-0 focus:ring-0 focus:ring-inset text-white bg-transparent text-center"
            onBlur={handleInputBlur}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-1">
        <p>{t("input_password")}</p>
        <div className="border-2 border-primary rounded-3xl w-full flex items-center justify-center">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="********"
            className="border-0 focus:ring-0 focus:ring-inset text-white bg-transparent text-center"
            onBlur={handleInputBlur}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * ArcGISControls component provides UI controls for ArcGIS operations.
 * It includes buttons to toggle the "Erase" and "Snapshot" functionalities.
 *
 * @returns {JSX.Element} The rendered ArcGISControls component.
 */
export const ArcGISControls = (): JSX.Element => {
  const t = useTranslations("appDropdownHelper");
  const { inputData, setInputData } = useInputData();

  /**
   * Handles the control change event for the buttons.
   * Toggles the state of the corresponding control based on the button ID.
   *
   * @param {MouseEvent<HTMLButtonElement>} event - The click event object.
   */
  const handleControlChange = (event: MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    if (id === "arcgisErase") {
      setInputData((prevDataChoices: InputDataProps) => ({
        ...prevDataChoices,
        arcgisErase: !prevDataChoices.arcgisErase,
      }));
    } else if (id === "arcgisSnapshot") {
      setInputData((prevDataChoices: InputDataProps) => ({
        ...prevDataChoices,
        arcgisSnapshot: !prevDataChoices.arcgisSnapshot,
      }));
    }
  };

  return (
    <div className="grid grid-cols-2 w-fit gap-3">
      <div className="flex flex-col items-center gap-1">
        <p className="text-center">{t("control_erase")}</p>
        <Button
          isIconOnly
          id="arcgisErase"
          name="arcgisErase"
          variant="bordered"
          color={inputData.arcgisErase ? "success" : "danger"}
          onClick={handleControlChange}>
          {inputData.arcgisErase ? <ThumbsUpIcon /> : <ThumbsDownIcon />}
        </Button>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-center">{t("control_snap")}</p>
        <Button
          isIconOnly
          id="arcgisSnapshot"
          name="arcgisSnapshot"
          variant="bordered"
          color={inputData.arcgisSnapshot ? "success" : "danger"}
          onClick={handleControlChange}>
          {inputData.arcgisSnapshot ? <ThumbsUpIcon /> : <ThumbsDownIcon />}
        </Button>
      </div>
    </div>
  );
};
