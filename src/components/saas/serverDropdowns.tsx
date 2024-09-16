"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { availableDatabases } from "@/src/config/saasDatabases";
import { cn } from "@/lib/utils";
import { fetchDbSchemas, fetchSchemaTables } from "@/lib/dbRequests";
import { stripHtmlTags } from "@/lib/utils";

import { TxtPlaceholder } from "../pulsePlaceholder";

export interface InputDataProps {
  dbChoice: string | null;
  schemaChoice: string | null;
  tableChoice: string | null;
}

export interface TaskDataProps {
  taskId: string | null;
  taskStatus: string | null;
  taskResult: any;
  downloadUrl: string | null;
  isLoading: boolean;
}

export interface DatabaseDropdownProps {
  appType?: string;
  dbClass: string;
  appTypeIncludeKey?: string | null;
  setInputData: React.Dispatch<React.SetStateAction<InputDataProps>>;
}

export interface SchemasDropdownProps {
  inputData: InputDataProps;
  setInputData: React.Dispatch<React.SetStateAction<InputDataProps>>;
}

export interface SchemaDropdownData {
  value: string;
  label: string;
}

export interface TablesDropdownProps {
  inputData: InputDataProps;
  setInputData: React.Dispatch<React.SetStateAction<InputDataProps>>;
  pattern: string;
}

export interface TableDropdownData {
  value: string;
  label: string;
}

export interface DisplayFieldChoiceProps {
  fieldChoice: string | null;
  nonce?: string;
}

export interface DisplayFieldGuidelineProps {
  guideline: string;
}

export interface DownloadButtonProps {
  downloadUrl: string | null;
  nonce?: string;
}

export interface DropDownSelectorProps {
  items: SchemaDropdownData[] | TableDropdownData[];
  selectedKey: string;
  setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
  selectedLabel: string;
  handleSelect: (key: string) => void;
}

export interface DefaultButtonSelectorProps {
  label: string;
  isDisabled?: boolean;
  type?: "default" | "danger";
}

/**
 * Default button selector component.
 *
 * @param {DefaultButtonSelectorProps} props - The props for the component.
 * @param {string} props.label - The label to display on the button.
 * @param {boolean} [props.isDisabled=false] - Whether the button is disabled.
 * @param {string} [props.type] - The type of the button (e.g., "danger").
 * @returns {JSX.Element} The rendered component.
 */
export const DefaultButtonSelector = ({
  label,
  isDisabled = false,
  type,
}: DefaultButtonSelectorProps): JSX.Element => {
  const t = useTranslations();

  return (
    <Button
      className={cn("border-primary bg-transparent min-w-96 h-10", {
        "border-danger text-danger bg-transparent min-w-96 h-10":
          type === "danger",
      })}
      isDisabled={isDisabled ? true : false}
      radius="full"
      variant="bordered"
    >
      {t(label)}
    </Button>
  );
};

/**
 * Default dropdown selector component.
 *
 * @param {DropDownSelectorProps} props - The props for the component.
 * @param {Array<{ value: string; label: string }>} props.items - The items to display in the dropdown.
 * @param {string} props.selectedLabel - The label of the selected item.
 * @param {string} props.selectedKey - The key of the selected item.
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setSelectedKey - The function to update the selected key.
 * @param {(key: string) => void} props.handleSelect - The function to handle item selection.
 * @returns {JSX.Element} The rendered component.
 */
export const DropDownSelector = ({
  items,
  selectedLabel,
  selectedKey,
  setSelectedKey,
  handleSelect,
}: DropDownSelectorProps): JSX.Element => {
  return (
    <Dropdown backdrop="blur">
      <DropdownTrigger>
        <Button
          className="bg-primary text-white min-w-96 h-10"
          radius="full"
          variant="solid"
        >
          {selectedLabel}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="dropdown menu"
        className="max-h-48 overflow-y-auto"
        items={items}
        selectedKeys={new Set([selectedKey])}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;

          setSelectedKey(selected);
        }}
      >
        {(item) => (
          <DropdownItem
            key={item.value}
            onClick={() => handleSelect(item.value)}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

/**
 * Component for selecting a database.
 *
 * @param {DatabaseDropdownProps} props - The props for the component.
 * @param {AppType} props.appType - The application type (e.g., "hld", "lld", "snap", "admin").
 * @param {string} props.dbClass - The database class.
 * @param {string | null} [props.appTypeIncludeKey=null] - Optional key to include for the "admin" app type.
 * @param {React.Dispatch<React.SetStateAction<InputDataProps>>} props.setInputData - The function to update input data.
 * @returns {JSX.Element} The rendered component.
 */
export const DatabaseDropdown = ({
  appType,
  dbClass,
  appTypeIncludeKey = null,
  setInputData,
}: DatabaseDropdownProps): JSX.Element => {
  const t = useTranslations("ServerDropdowns");

  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [selectedKey, setSelectedKey] = useState<string>("select_database");
  const [selectedLabel, setSelectedLabel] = useState<string>(t("dbMenu_label"));

  // Populate database dropdown options based on appType and dbClass
  useEffect(() => {
    const populateDatabaseDropdown = () => {
      const newOptions = [];

      if (availableDatabases[dbClass]) {
        for (let key in availableDatabases[dbClass]) {
          if (appType === "hld" && key.includes("_main")) {
            newOptions.push({
              value: key,
              label: availableDatabases[dbClass][key],
            });
          } else if (appType === "lld" && key.includes("_prod")) {
            newOptions.push({
              value: key,
              label: availableDatabases[dbClass][key],
            });
          } else if (appType === "snap" && key.includes("_snap")) {
            newOptions.push({
              value: key,
              label: availableDatabases[dbClass][key],
            });
          } else if (
            appType === "admin" &&
            appTypeIncludeKey &&
            key.includes(appTypeIncludeKey)
          ) {
            newOptions.push({
              value: key,
              label: availableDatabases[dbClass][key],
            });
          } else if (!["hld", "lld", "snap", "admin"].includes(appType ?? "")) {
            newOptions.push({
              value: key,
              label: availableDatabases[dbClass][key],
            });
          }
        }
      }
      setOptions(newOptions);
    };

    populateDatabaseDropdown();
  }, [appType, dbClass, appTypeIncludeKey]);

  // Update selected label when selected key or options change
  useEffect(() => {
    const label =
      options.find((option) => option.value === selectedKey)?.label ||
      t("dbMenu_label");

    setSelectedLabel(label);
  }, [selectedKey, options]);

  /**
   * Handles the selection of a database.
   *
   * @param {string} key - The key of the selected database.
   */
  const handleSelect = (key: string) => {
    setInputData((prevDataChoices: InputDataProps) => ({
      ...prevDataChoices,
      dbChoice: key,
    }));
  };

  return (
    <DropDownSelector
      handleSelect={handleSelect}
      items={options}
      selectedKey={selectedKey}
      selectedLabel={selectedLabel}
      setSelectedKey={setSelectedKey}
    />
  );
};

/**
 * Component for selecting a schema.
 *
 * @param {SchemasDropdownProps} props - The props for the component.
 * @param {InputDataProps} props.inputData - The input data containing database choice.
 * @param {React.Dispatch<React.SetStateAction<InputDataProps>>} props.setInputData - The function to update input data.
 * @returns {JSX.Element} The rendered component.
 */
export const SchemasDropdown = ({
  inputData,
  setInputData,
}: SchemasDropdownProps): JSX.Element => {
  const t = useTranslations("ServerDropdowns");

  const [dbSchemas, setDbSchemas] = useState<SchemaDropdownData[] | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>("select_schema");
  const [selectedLabel, setSelectedLabel] = useState<string>(
    t("schMenu_label"),
  );

  // Fetch schemas when database choice changes
  useEffect(() => {
    const fetchSchemas = async () => {
      if (inputData.dbChoice) {
        const schemas = await fetchDbSchemas({
          target_db: inputData.dbChoice,
        });

        setDbSchemas(schemas);
      }
    };

    fetchSchemas();
  }, [inputData.dbChoice]);

  // Update selected label when selected key or database schemas change
  useEffect(() => {
    const label =
      dbSchemas?.find((schema) => schema.value === selectedKey)?.label ||
      t("schMenu_label");

    setSelectedLabel(label);
  }, [selectedKey, dbSchemas]);

  /**
   * Handles the selection of a schema.
   *
   * @param {string} key - The key of the selected schema.
   */
  const handleSelect = (key: string) => {
    setInputData((prevDataChoices: InputDataProps) => ({
      ...prevDataChoices,
      schemaChoice: key,
    }));
  };

  return (
    <div>
      {dbSchemas ? (
        dbSchemas[0].value !== "no_data" ? (
          <DropDownSelector
            handleSelect={handleSelect}
            items={dbSchemas}
            selectedKey={selectedKey}
            selectedLabel={selectedLabel}
            setSelectedKey={setSelectedKey}
          />
        ) : (
          <DefaultButtonSelector
            label="ServerDropdowns.menuNoData"
            type="danger"
          />
        )
      ) : (
        <DefaultButtonSelector
          isDisabled={true}
          label="ServerDropdowns.schMenu_loading"
        />
      )}
    </div>
  );
};

/**
 * Component for selecting a table.
 *
 * @param {TablesDropdownProps} props - The props for the component.
 * @param {InputDataProps} props.inputData - The input data containing database and schema choices.
 * @param {React.Dispatch<React.SetStateAction<InputDataProps>>} props.setInputData - The function to update input data.
 * @param {string} props.pattern - The user pattern for filtering tables.
 * @returns {JSX.Element} The rendered component.
 */
export const TablesDropdown = ({
  inputData,
  setInputData,
  pattern,
}: TablesDropdownProps): JSX.Element => {
  const t = useTranslations("ServerDropdowns");

  const [schTables, setSchTables] = useState<TableDropdownData[] | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>("select_table");
  const [selectedLabel, setSelectedLabel] = useState<string>(
    t("tblMenu_label"),
  );

  // Fetch tables when database or schema choice changes
  useEffect(() => {
    const fetchTables = async () => {
      if (inputData.dbChoice && inputData.schemaChoice) {
        const tables = await fetchSchemaTables({
          target_db: inputData.dbChoice,
          schema_choice: inputData.schemaChoice,
          user_pattern: pattern,
        });
        // Sort the tables array before setting it
        const sortedTables = tables.sort(
          (a: TableDropdownData, b: TableDropdownData) =>
            a.label.localeCompare(b.label),
        );

        setSchTables(sortedTables);
      }
    };

    fetchTables();
  }, [inputData.dbChoice, inputData.schemaChoice]);

  // Update selected label when selected key or schema tables change
  useEffect(() => {
    const label =
      schTables?.find((table) => table.value === selectedKey)?.label ||
      t("tblMenu_label");

    setSelectedLabel(label);
  }, [selectedKey, schTables]);

  /**
   * Handles the selection of a table.
   *
   * @param {string} key - The key of the selected table.
   */
  const handleSelect = (key: string) => {
    setInputData((prevDataChoices: InputDataProps) => ({
      ...prevDataChoices,
      tableChoice: key,
    }));
  };

  return (
    <div>
      {schTables ? (
        schTables[0].value !== "no_data" ? (
          <DropDownSelector
            handleSelect={handleSelect}
            items={schTables}
            selectedKey={selectedKey}
            selectedLabel={selectedLabel}
            setSelectedKey={setSelectedKey}
          />
        ) : (
          <DefaultButtonSelector
            label="ServerDropdowns.menuNoData"
            type="danger"
          />
        )
      ) : (
        <DefaultButtonSelector
          isDisabled={true}
          label="ServerDropdowns.tblMenu_loading"
        />
      )}
    </div>
  );
};

/**
 * Component for displaying the selected field choice.
 *
 * @param {DisplayFieldChoiceProps} props - The props for the component.
 * @param {string} props.fieldChoice - The selected field choice to display.
 * @param {string} props.nonce - The nonce for inline styles.
 * @returns {JSX.Element} The rendered component.
 */
export const DisplayFieldChoice = ({
  fieldChoice,
  nonce,
}: DisplayFieldChoiceProps): JSX.Element => {
  return (
    <div>
      {fieldChoice ? (
        <div
          className="border-2 border-primary rounded-3xl min-w-96 h-10 flex items-center justify-center"
          nonce={nonce}
        >
          {fieldChoice}
        </div>
      ) : (
        <div
          className="border-2 border-primary rounded-3xl p-2 max-w-96 h-10"
          nonce={nonce}
        >
          <TxtPlaceholder nonce={nonce} />
        </div>
      )}
    </div>
  );
};

/**
 * Component for displaying a field guideline.
 *
 * @param {DisplayFieldGuidelineProps} props - The props for the component.
 * @param {string} props.guideline - The guideline text to display.
 * @returns {JSX.Element} The rendered component.
 */
export const DisplayFieldGuideline = ({
  guideline,
}: DisplayFieldGuidelineProps): JSX.Element => {
  return (
    <div className="border-b-2 border-primary min-w-96 h-10 flex items-center justify-start indent-4">
      {guideline}
    </div>
  );
};

/**
 * Component for downloading the task result.
 *
 * @param {DownloadButtonProps} props - The props for the component.
 * @param {string} props.downloadUrl - The URL to download the task result from.
 * @param {string} props.nonce - The nonce for inline styles.
 * @returns {JSX.Element} The rendered component.
 */
export const DownloadButton = ({
  downloadUrl,
  nonce,
}: DownloadButtonProps): JSX.Element => {
  /**
   * Handles the download process by creating a temporary link element
   * and triggering a click event on it.
   */
  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a");

      link.href = downloadUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      {downloadUrl ? (
        <Button
          className="bg-primary text-white min-w-96 h-10"
          nonce={nonce}
          radius="full"
          variant="solid"
          onClick={handleDownload}
        >
          Download
        </Button>
      ) : (
        <div className="border-2 border-primary rounded-3xl p-2 max-w-96 h-10">
          <TxtPlaceholder nonce={nonce} />
        </div>
      )}
    </div>
  );
};

/**
 * Component for displaying the task result as plain text.
 *
 * @param {DisplayFieldChoiceProps} props - The props for the component.
 * @param {string} props.fieldChoice - The HTML string to be stripped of tags.
 * @param {string} props.nonce - The nonce for inline styles.
 * @returns {JSX.Element} The rendered component.
 */
export const DisplayFieldChoiceHtml = ({
  fieldChoice,
  nonce,
}: DisplayFieldChoiceProps): JSX.Element => {
  const [plainText, setPlainText] = useState<string>("");

  // Effect hook to strip HTML tags from fieldChoice and set plain text
  useEffect(() => {
    if (fieldChoice && typeof window !== "undefined") {
      setPlainText(stripHtmlTags(fieldChoice));
    }
  }, [fieldChoice]);

  return (
    <div>
      {plainText ? (
        <div
          className="border-2 border-primary rounded-3xl min-w-96 h-10 flex items-center justify-center"
          nonce={nonce}
        >
          {plainText}
        </div>
      ) : (
        <div className="border-2 border-primary rounded-3xl p-2 max-w-96 h-10">
          <TxtPlaceholder nonce={nonce} />
        </div>
      )}
    </div>
  );
};
