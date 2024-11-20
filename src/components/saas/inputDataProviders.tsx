"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";

import { stripHtmlTags, maskPassword } from "@/src/lib/utils";
import { InputDataProps, TaskDataProps } from "@/interfaces/lib";

/**
 * Interface for the InputDataContext properties.
 */
interface InputDataContextProps {
  inputData: InputDataProps;
  setInputData: React.Dispatch<React.SetStateAction<InputDataProps>>;
  taskData: TaskDataProps;
  setTaskData: React.Dispatch<React.SetStateAction<TaskDataProps>>;
  consoleOutput: string;
  appendToConsole: (newData: string) => void;
  appName: string;
  setAppName: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Context for managing input and task data.
 */
const InputDataContext = createContext<InputDataContextProps | undefined>(
  undefined,
);

/**
 * Custom hook to use input data context.
 *
 * @returns {object} The input data and setter function.
 * @throws Will throw an error if used outside of InputDataProvider.
 */
export const useInputData = (): {
  inputData: InputDataProps;
  setInputData: React.Dispatch<React.SetStateAction<InputDataProps>>;
} => {
  const context = useContext(InputDataContext);

  if (!context) {
    throw new Error("useInputData must be used within an InputDataProvider");
  }

  return {
    inputData: context.inputData,
    setInputData: context.setInputData,
  };
};

/**
 * Custom hook to use task data context.
 *
 * @returns {object} The task data and setter function.
 * @throws Will throw an error if used outside of InputDataProvider.
 */
export const useTaskData = (): {
  taskData: TaskDataProps;
  setTaskData: React.Dispatch<React.SetStateAction<TaskDataProps>>;
} => {
  const context = useContext(InputDataContext);

  if (!context) {
    throw new Error("useTaskData must be used within an InputDataProvider");
  }

  return {
    taskData: context.taskData,
    setTaskData: context.setTaskData,
  };
};

/**
 * Custom hook to use app name context.
 *
 * @returns {object} The app name and setter function.
 * @throws Will throw an error if used outside of InputDataProvider.
 */
export const useAppName = (): {
  appName: string;
  setAppName: React.Dispatch<React.SetStateAction<string>>;
} => {
  const context = useContext(InputDataContext);

  if (!context) {
    throw new Error("useAppName must be used within an InputDataProvider");
  }

  return {
    appName: context.appName,
    setAppName: context.setAppName,
  };
};

/**
 * Custom hook to use console data context.
 *
 * @returns {object} The console output and append function.
 * @throws Will throw an error if used outside of InputDataProvider.
 */
export const useConsoleData = (): {
  consoleOutput: string;
  appendToConsole: (newData: string) => void;
} => {
  const context = useContext(InputDataContext);

  if (!context) {
    throw new Error("useConsoleData must be used within an InputDataProvider");
  }

  return {
    consoleOutput: context.consoleOutput,
    appendToConsole: context.appendToConsole,
  };
};

/**
 * Provider component for input and task data context.
 *
 * @param {object} props - The props for the component.
 * @param {ReactNode} props.children - The child components.
 * @returns {JSX.Element} The rendered provider component.
 */
export const InputDataProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const initInputData: InputDataProps = {
    dbChoice: null,
    schemaChoice: null,
    tableChoice: null,
    appType: "",
    dbClass: "",
    clientName: "",
    taskEndpoint: "",
    asDownloadable: false,
    willOverride: false,
    uuidPole: "",
    operationChoice: "",
    file: undefined,
    fileName: null,
    tdsUsername: null,
    tdsPassword: null,
    arcgisErase: false,
    arcgisSnapshot: false,
    projectId: "",
    projectNum: "",
  };
  const initTaskData: TaskDataProps = {
    taskId: null,
    taskStatus: null,
    taskResult: null,
    downloadUrl: null,
    isLoading: false,
  };
  const initAppName: string = "";
  const [initialAppName, setInitialAppName] = useState<string>(initAppName);
  const [inputData, setInputData] = useState<InputDataProps>(initInputData);
  const [taskData, setTaskData] = useState<TaskDataProps>(initTaskData);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [appName, setAppName] = useState<string>(initAppName);

  // Store previous inputData and taskData to compare changes
  const prevInputDataRef = useRef<InputDataProps>(inputData);
  const prevTaskDataRef = useRef<TaskDataProps>(taskData);

  /**
   * Function to append new data to the console output.
   *
   * @param {string} newData - The new data to append.
   */
  const appendToConsole = (newData: string) => {
    setConsoleOutput((prevOutput) => prevOutput + "\n" + newData);
  };

  /**
   * Mapping of inputData keys to user-friendly labels or custom handlers.
   */
  const inputDataLabels: {
    [key in keyof InputDataProps]?: string | ((value: any) => string);
  } = {
    dbChoice: (value) => `$ InputData: db choice >> ${value}`,
    schemaChoice: (value) => `$ InputData: schema choice >> ${value}`,
    tableChoice: (value) => `$ InputData: table choice >> ${value}`,
    fileName: (value) => `$ InputData: file >> ${value}`,
    tdsUsername: (value) => `$ InputData: TDS username >> ${value}`,
    tdsPassword: (value) =>
      `$ InputData: TDS password >> ${maskPassword(value || "")}`,
    arcgisErase: (value) => `$ InputData: erase DFN in DB621 >> ${value}`,
    arcgisSnapshot: (value) => `$ InputData: create DFN snapshots >> ${value}`,
    uuidPole: (value) => `$ InputData: pole uuid >> ${value}`,
    projectId: (value) => `$ InputData: project ID >> ${value}`,
    projectNum: (value) => `$ InputData: project number >> ${value}`,
    operationChoice: (value) => `$ InputData: recover operation >> ${value}`,
    willOverride: (value) => {
      if (
        inputData.taskEndpoint ===
        "/saas/tds/ajax/super/query-change-ownership-uniq/"
      ) {
        return `$ InputData: assign ownership UNIQ >> ${value}`;
      } else if (
        inputData.taskEndpoint ===
        "/saas/tds/ajax/super/query-postgres-version/"
      ) {
        return `$ InputData: run full db >> ${value}`;
      } else if (inputData.appType === "override") {
        return `$ RemoteApp: !! >> will ERASE existing data`;
      }

      return `$ InputData: will override >> ${value}`;
    },
    // Add other fields as needed...
  };

  /**
   * Mapping of taskData keys to user-friendly labels or custom handlers.
   */
  const taskDataLabels: {
    [key in keyof TaskDataProps]?: string | ((value: any) => string);
  } = {
    taskId: (value) => `$ TaskData: task id >> ${value}`,
    taskStatus: (value) => `$ TaskData: task status >> ${value}`,
    taskResult: (value) => `$ TaskData: task result >> ${stripHtmlTags(value)}`,
    // Add other fields as needed...
  };

  /**
   * Detects changes between previous and current data, and logs descriptive messages.
   *
   * @param prevData - The previous state of the data object.
   * @param currentData - The current state of the data object.
   * @param labels - A mapping of data keys to user-friendly labels or custom message functions.
   */
  const detectChanges = (
    prevData: any,
    currentData: any,
    labels: { [key: string]: string | ((value: any) => string) },
  ) => {
    Object.keys(labels).forEach((key) => {
      if (prevData[key] !== currentData[key]) {
        const label = labels[key];
        let message = "";

        if (typeof label === "function") {
          message = label(currentData[key]);
        } else {
          message = `${label} >> ${currentData[key]}`;
        }

        appendToConsole(message);
      }
    });
  };

  /**
   * useEffect hook monitoring changes in 'inputData'.
   * When 'inputData' changes, detectChanges logs any updated fields to the console.
   */
  useEffect(() => {
    detectChanges(prevInputDataRef.current, inputData, inputDataLabels);
    prevInputDataRef.current = { ...inputData };
  }, [inputData]);

  /**
   * useEffect hook monitoring changes in 'taskData'.
   * When 'taskData' changes, detectChanges logs any updated fields to the console.
   */
  useEffect(() => {
    detectChanges(prevTaskDataRef.current, taskData, taskDataLabels);
    prevTaskDataRef.current = { ...taskData };
  }, [taskData]);

  /**
   * useEffect hook monitoring changes in 'appName'.
   * Logs initialization message when 'appName' changes.
   */
  useEffect(() => {
    if (appName !== initialAppName) {
      appendToConsole(`$ RemoteApp: initializing >> ${appName}`);
      setInitialAppName(appName);
    }
  }, [appName]);

  return (
    <InputDataContext.Provider
      value={{
        inputData,
        setInputData,
        taskData,
        setTaskData,
        consoleOutput,
        appendToConsole,
        appName,
        setAppName,
      }}
    >
      {children}
    </InputDataContext.Provider>
  );
};
