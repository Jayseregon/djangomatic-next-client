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
import DOMPurify from "dompurify";
import { availableDatabases } from "@/src/config/saasDatabases";
import { cn } from "@/lib/utils";
import { fetchDbSchemas, fetchSchemaTables } from "@/lib/dbRequests";

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

// default button selector component
export const DefaultButtonSelector = ({
  label,
  isDisabled = false,
  type,
}: DefaultButtonSelectorProps) => {
  const t = useTranslations();

  return (
    <Button
      className={cn("border-primary bg-transparent min-w-96 h-10", {
        "border-danger text-danger bg-transparent min-w-96 h-10":
          type === "danger",
      })}
      isDisabled={isDisabled ? true : false}
      radius="full"
      variant="bordered">
      {t(label)}
    </Button>
  );
};

// default dropdown selector component
export const DropDownSelector = ({
  items,
  selectedLabel,
  selectedKey,
  setSelectedKey,
  handleSelect,
}: DropDownSelectorProps) => {
  return (
    <Dropdown backdrop="blur">
      <DropdownTrigger>
        <Button
          className="bg-primary text-white min-w-96 h-10"
          radius="full"
          variant="solid">
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
        }}>
        {(item) => (
          <DropdownItem
            key={item.value}
            onClick={() => handleSelect(item.value)}>
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

// Component for selecting a database
export const DatabaseDropdown = ({
  appType,
  dbClass,
  appTypeIncludeKey = null,
  setInputData,
}: DatabaseDropdownProps) => {
  const t = useTranslations("ServerDropdowns");

  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [selectedKey, setSelectedKey] = useState<string>("select_database");
  const [selectedLabel, setSelectedLabel] = useState<string>(t("dbMenu_label"));

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

  useEffect(() => {
    const label =
      options.find((option) => option.value === selectedKey)?.label ||
      t("dbMenu_label");

    setSelectedLabel(label);
  }, [selectedKey, options]);

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

// Component for selecting a schema
export const SchemasDropdown = ({
  inputData,
  setInputData,
}: SchemasDropdownProps) => {
  const t = useTranslations("ServerDropdowns");

  const [dbSchemas, setDbSchemas] = useState<SchemaDropdownData[] | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>("select_schema");
  const [selectedLabel, setSelectedLabel] = useState<string>(
    t("schMenu_label")
  );

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

  useEffect(() => {
    const label =
      dbSchemas?.find((schema) => schema.value === selectedKey)?.label ||
      t("schMenu_label");

    setSelectedLabel(label);
  }, [selectedKey, dbSchemas]);

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

// Component for selecting a table
export const TablesDropdown = ({
  inputData,
  setInputData,
  pattern,
}: TablesDropdownProps) => {
  const t = useTranslations("ServerDropdowns");

  const [schTables, setSchTables] = useState<TableDropdownData[] | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>("select_table");
  const [selectedLabel, setSelectedLabel] = useState<string>(
    t("tblMenu_label")
  );

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
            a.label.localeCompare(b.label)
        );

        setSchTables(sortedTables);
      }
    };

    fetchTables();
  }, [inputData.dbChoice, inputData.schemaChoice]);

  useEffect(() => {
    const label =
      schTables?.find((table) => table.value === selectedKey)?.label ||
      t("tblMenu_label");

    setSelectedLabel(label);
  }, [selectedKey, schTables]);

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

// Components for displaying the selected field choice
export const DisplayFieldChoice = ({
  fieldChoice,
  nonce,
}: DisplayFieldChoiceProps) => {
  return (
    <div>
      {fieldChoice ? (
        <div
          className="border-2 border-primary rounded-3xl min-w-96 h-10 flex items-center justify-center"
          nonce={nonce}>
          {fieldChoice}
        </div>
      ) : (
        <div
          className="border-2 border-primary rounded-3xl p-2 max-w-96 h-10"
          nonce={nonce}>
          <TxtPlaceholder nonce={nonce} />
        </div>
      )}
    </div>
  );
};

// Component for downloading the task result
export const DownloadButton = ({ downloadUrl, nonce }: DownloadButtonProps) => {
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
          onClick={handleDownload}>
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

// Component for displaying the task result as sanitized html
export const DisplayFieldChoiceHtml = ({
  fieldChoice,
  nonce,
}: DisplayFieldChoiceProps) => {
  // Sanitize the HTML content and add the nonce to inline styles
  const sanitizedHtml = DOMPurify.sanitize(fieldChoice || "", {
    ADD_ATTR: ["nonce"],
    ADD_TAGS: ["style"],
    FORCE_BODY: true,
    IN_PLACE: true,
  });

  return (
    <div>
      {fieldChoice ? (
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          className="border-2 border-primary rounded-3xl min-w-96 h-10 flex items-center justify-center"
          nonce={nonce}
        />
      ) : (
        <div className="border-2 border-primary rounded-3xl p-2 max-w-96 h-10">
          <TxtPlaceholder nonce={nonce} />
        </div>
      )}
    </div>
  );
};
