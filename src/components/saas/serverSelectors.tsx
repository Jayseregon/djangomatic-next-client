"use client";

import React, { ChangeEvent, useState, type JSX } from "react";
import { useTranslations } from "next-intl";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Progress,
  Spinner,
} from "@nextui-org/react";
import DOMPurify from "dompurify";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { sanitizeFileName } from "@/lib/utils";
import { ThumbsUpIcon, ThumbsDownIcon } from "@/components/icons";
import { InputDataProps } from "@/interfaces/lib";

import { useInputData } from "./inputDataProviders";
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
        <SchemasDropdown inputData={inputData} setInputData={setInputData} />
        {/* Dropdown for selecting a table */}
        <TablesDropdown
          endpoint={endpoint}
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
        <SchemasDropdown inputData={inputData} setInputData={setInputData} />
      </div>
    </div>
  );
};

/**
 * Component for file input button.
 *
 * @returns {JSX.Element} The rendered component.
 */
export const ZipFileInputButton = (): JSX.Element => {
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
          htmlFor="file-input"
        >
          <span>{t("zipFile.label")}</span>
          <input
            accept=".zip"
            aria-label="file-input"
            className="sr-only"
            id="file-input"
            name="file-input"
            type="file"
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
            className="border-0 focus:ring-0 focus:ring-inset text-white bg-transparent text-center"
            id="username"
            name="username"
            placeholder="freddie_mercury"
            type="text"
            onBlur={handleInputBlur}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-1">
        <p>{t("input_password")}</p>
        <div className="border-2 border-primary rounded-3xl w-full flex items-center justify-center">
          <input
            className="border-0 focus:ring-0 focus:ring-inset text-white bg-transparent text-center"
            id="password"
            name="password"
            placeholder="********"
            type="password"
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
   * @param {string} id - The ID of the button clicked.
   */
  const handleControlChange = (id: string) => {
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
          aria-label={t("control_erase")}
          color={inputData.arcgisErase ? "success" : "danger"}
          id="arcgisErase"
          name="arcgisErase"
          variant="bordered"
          onPress={() => handleControlChange("arcgisErase")}
        >
          {inputData.arcgisErase ? <ThumbsUpIcon /> : <ThumbsDownIcon />}
        </Button>
        <p className="text-center">{t("control_snap")}</p>
        <Button
          isIconOnly
          aria-label={t("control_snap")}
          color={inputData.arcgisSnapshot ? "success" : "danger"}
          id="arcgisSnapshot"
          name="arcgisSnapshot"
          variant="bordered"
          onPress={() => handleControlChange("arcgisSnapshot")}
        >
          {inputData.arcgisSnapshot ? <ThumbsUpIcon /> : <ThumbsDownIcon />}
        </Button>
      </div>
    </div>
  );
};

/**
 * SuperVersionControl component for toggling the override state.
 * Displays a button that toggles the `willOverride` state in `inputData`.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.btnHelper - The helper text for the button.
 * @returns {JSX.Element} The rendered SuperVersionControl component.
 */
export const SuperVersionControl = ({
  btnHelper,
}: {
  btnHelper: string;
}): JSX.Element => {
  const t = useTranslations("appDropdownHelper");
  const { inputData, setInputData } = useInputData();

  /**
   * Handle button click event.
   * Toggles the `willOverride` state in `inputData`.
   */
  const handleControlChange = () => {
    setInputData((prevDataChoices: InputDataProps) => ({
      ...prevDataChoices,
      willOverride: !prevDataChoices.willOverride,
    }));
  };

  return (
    <div className="flex justify-end w-full">
      <div className="flex flex-col items-center gap-1">
        <p className="text-center">{t(btnHelper)}</p>
        <Button
          isIconOnly
          color={inputData.willOverride ? "success" : "danger"}
          id="versionControle"
          variant="bordered"
          onPress={handleControlChange}
        >
          {inputData.willOverride ? <ThumbsUpIcon /> : <ThumbsDownIcon />}
        </Button>
      </div>
    </div>
  );
};

/**
 * Component for inputting a UUID.
 * Validates and sanitizes the input to ensure it is a valid string and not malicious code.
 *
 * @returns {JSX.Element} The rendered PoleUuidInput component.
 */
export const PoleUuidInput = (): JSX.Element => {
  const t = useTranslations("appDropdownHelper");
  const { setInputData } = useInputData();

  /**
   * Handle input blur event.
   * Sanitizes the input to ensure it is a valid string and updates the input data state.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The blur event.
   */
  const handleInputBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const uuidInput = event.target.value.trim();
    // Sanitize the input to remove any potentially malicious code
    const sanitizedInput = DOMPurify.sanitize(uuidInput);

    // Update the input data state with the sanitized input
    setInputData((prevDataChoices: InputDataProps) => ({
      ...prevDataChoices,
      uuidPole: sanitizedInput,
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-8 pb-8">
      {/* Display guidelines for the input field */}
      <DisplayFieldGuideline guideline={t("input_uuidPole")} />
      <div className="border-2 border-primary rounded-3xl w-full flex items-center justify-center">
        <input
          className="border-0 focus:ring-0 focus:ring-inset text-white bg-transparent text-center"
          id="uuidPole"
          name="uuidPole"
          placeholder="xxxxx-xxxx-xxxx-xxxx-xxxx"
          type="text"
          onBlur={handleInputBlur}
        />
      </div>
    </div>
  );
};

/**
 * DropdownOperationSelector component for selecting an operation.
 * Displays hardcoded choices and updates the inputData state with the selected value.
 *
 * @returns {JSX.Element} The rendered DropdownOperationSelector component.
 */
export const DropdownOperationSelector = (): JSX.Element => {
  const t = useTranslations();
  const { setInputData } = useInputData();
  const [selectedLabel, setSelectedLabel] = useState<string>(
    t("ServerDropdowns.operation_label"),
  );

  // Hardcoded choices
  const items = [
    { label: "DELETE", value: "DELETE" },
    { label: "INITIAL", value: "INITIAL" },
    { label: "UPDATE", value: "UPDATE" },
    { label: "INSERT", value: "INSERT" },
  ];

  /**
   * Handle selection change event.
   * Updates the selected label and input data state.
   *
   * @param {string} selected - The selected value.
   */
  const handleSelectionChange = (selected: string) => {
    setSelectedLabel(selected);
    setInputData((prevDataChoices: InputDataProps) => ({
      ...prevDataChoices,
      operationChoice: selected,
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-8 pb-8">
      {/* Display guidelines for the dropdown */}
      <DisplayFieldGuideline guideline={t("appDropdownHelper.recover_op")} />
      <Dropdown backdrop="blur">
        <DropdownTrigger>
          <Button
            className="bg-primary text-white w-full h-10"
            radius="full"
            variant="solid"
          >
            {selectedLabel}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="dropdown operation choices"
          className="max-h-48 overflow-y-auto"
          items={items}
          selectionMode="single"
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;

            handleSelectionChange(selected);
          }}
        >
          {(item) => <DropdownItem key={item.value}>{item.label}</DropdownItem>}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export const InputTelusCandidateProjectInfo = (): JSX.Element => {
  const t = useTranslations("appDropdownHelper");
  const { setInputData } = useInputData();

  const handleInputBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "project_id") {
      setInputData((prevDataChoices: InputDataProps) => ({
        ...prevDataChoices,
        projectId: value,
      }));
    } else if (name === "project_num") {
      setInputData((prevDataChoices: InputDataProps) => ({
        ...prevDataChoices,
        projectNum: value,
      }));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 pb-5">
      <div className="grid grid-cols-1 gap-1">
        <p>{t("project_id")}</p>
        <div className="border-2 border-primary rounded-3xl w-full flex items-center justify-center">
          <input
            className="border-0 focus:ring-0 focus:ring-inset text-white bg-transparent text-center"
            id="project_id"
            name="project_id"
            placeholder="1234567"
            type="text"
            onBlur={handleInputBlur}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-1">
        <p>{t("project_num")}</p>
        <div className="border-2 border-primary rounded-3xl w-full flex items-center justify-center">
          <input
            className="border-0 focus:ring-0 focus:ring-inset text-white bg-transparent text-center"
            id="project_num"
            name="project_num"
            placeholder="9876543"
            type="text"
            onBlur={handleInputBlur}
          />
        </div>
      </div>
    </div>
  );
};

export const InputTelusZipfileButton = (): JSX.Element => {
  const t = useTranslations("ServerDropdowns");
  const { setInputData } = useInputData();
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      const sanitizedZipfileName = sanitizeFileName(file.name);
      const uuid = uuidv4();

      try {
        // Set up the EventSource for progress updates
        const eventSource = new EventSource(
          `/api/azure-blob/progress?uuid=${uuid}`,
        );

        eventSource.onmessage = (event) => {
          const progress = JSON.parse(event.data);

          setUploadProgress((progress.bytesUploaded / file.size) * 100);
        };

        eventSource.onerror = () => {
          eventSource.close();
        };

        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
          const start = chunkIndex * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunk = file.slice(start, end);

          const formData = new FormData();

          formData.append("chunk", chunk);
          formData.append("chunkIndex", chunkIndex.toString());
          formData.append("totalChunks", totalChunks.toString());
          formData.append("zipfileName", sanitizedZipfileName);
          formData.append("uuid", uuid);

          const res = await axios.post(
            "/api/azure-blob/telus-zip/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          console.log("Upload successful: ", res.data);

          if (res.status === 200) {
            setInputData((prevDataChoices: InputDataProps) => ({
              ...prevDataChoices,
              fileName: res.data.azurePath,
            }));
          } else {
            throw new Error("Upload failed.");
          }

          // Update upload progress after each chunk
          setUploadProgress(((chunkIndex + 1) / totalChunks) * 100);
        }

        // Close the EventSource after upload is complete
        eventSource.close();

        setFile(null);
        setFileName(null);
      } catch (error) {
        console.error("Upload failed:", error);
        throw new Error("Upload failed.");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-8">
        <DisplayFieldGuideline guideline={t("zipFile.helperText")} />
        <div className="flex w-full inline-block rounded-3xl bg-transparent border-0 text-sm text-white ring-1 ring-inset ring-primary">
          <label
            className="flex items-center justify-center w-20 h-10 bg-primary text-sm text-white text-center rounded-l-3xl ps-2"
            htmlFor="file-input"
          >
            <span>{t("zipFile.label")}</span>
            <input
              accept=".zip"
              aria-label="file-input"
              className="sr-only"
              id="file-input"
              name="file-input"
              type="file"
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
      <div className="grid grid-cols-2 gap-8">
        <Progress
          showValueLabel
          aria-label="upload-progress"
          className="mt-4"
          color="primary"
          maxValue={100}
          value={uploadProgress}
        />
        <div className="h-full w-full content-end">
          <Button
            aria-label="upload-button"
            className="bg-primary text-white w-full"
            disabled={isUploading}
            isDisabled={isUploading}
            radius="full"
            onPress={handleUpload}
          >
            {isUploading ? (
              <Spinner aria-label="upload-spinner" color="white" size="sm" />
            ) : (
              t("zipFile.upload")
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
