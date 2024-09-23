"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { stripHtmlTags, maskPassword } from "@/src/lib/utils";

import { InputDataProps, TaskDataProps } from "./serverDropdowns";

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
  };
  const initTaskData: TaskDataProps = {
    taskId: null,
    taskStatus: null,
    taskResult: null,
    downloadUrl: null,
    isLoading: false,
  };
  const initAppName: string = "";
  const [initialInputData, setInitialInputData] =
    useState<InputDataProps>(initInputData);
  const [initialTaskData, setInitialTaskData] =
    useState<TaskDataProps>(initTaskData);
  const [initialAppName, setInitialAppName] = useState<string>(initAppName);
  const [inputData, setInputData] = useState<InputDataProps>(initInputData);
  const [taskData, setTaskData] = useState<TaskDataProps>(initTaskData);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [appName, setAppName] = useState<string>(initAppName);

  /**
   * Function to append new data to the console output.
   *
   * @param {string} newData - The new data to append.
   */
  const appendToConsole = (newData: string) => {
    setConsoleOutput((prevOutput) => prevOutput + "\n" + newData);
  };

  // Watch for changes in inputData and append to console
  useEffect(() => {
    if (inputData.dbChoice !== initialInputData.dbChoice) {
      appendToConsole(`$ InputData: db choice >> ${inputData.dbChoice}`);
      setInitialInputData({
        ...initialInputData,
        dbChoice: inputData.dbChoice,
      });
    }
    if (inputData.schemaChoice !== initialInputData.schemaChoice) {
      appendToConsole(
        `$ InputData: schema choice >> ${inputData.schemaChoice}`,
      );
      setInitialInputData({
        ...initialInputData,
        schemaChoice: inputData.schemaChoice,
      });
    }
    if (inputData.tableChoice !== initialInputData.tableChoice) {
      appendToConsole(`$ InputData: table choice >> ${inputData.tableChoice}`);
      setInitialInputData({
        ...initialInputData,
        tableChoice: inputData.tableChoice,
      });
    }
    if (inputData.fileName !== initialInputData.fileName) {
      appendToConsole(`$ InputData: file >> ${inputData.fileName}`);
      setInitialInputData({
        ...initialInputData,
        fileName: inputData.fileName,
      });
    }
    if (inputData.tdsUsername !== initialInputData.tdsUsername) {
      appendToConsole(`$ InputData: TDS username >> ${inputData.tdsUsername}`);
      setInitialInputData({
        ...initialInputData,
        tdsUsername: inputData.tdsUsername,
      });
    }
    if (inputData.tdsPassword !== initialInputData.tdsPassword) {
      appendToConsole(
        `$ InputData: TDS password >> ${maskPassword(inputData.tdsPassword || "")}`,
      );
      setInitialInputData({
        ...initialInputData,
        tdsPassword: inputData.tdsPassword,
      });
    }
    if (inputData.arcgisErase !== initialInputData.arcgisErase) {
      appendToConsole(
        `$ InputData: erase DFN in DB621 >> ${inputData.arcgisErase}`,
      );
      setInitialInputData({
        ...initialInputData,
        arcgisErase: inputData.arcgisErase,
      });
    }
    if (inputData.arcgisSnapshot !== initialInputData.arcgisSnapshot) {
      appendToConsole(
        `$ InputData: create DFN snapshots >> ${inputData.arcgisSnapshot}`,
      );
      setInitialInputData({
        ...initialInputData,
        arcgisSnapshot: inputData.arcgisSnapshot,
      });
    }
    if (inputData.uuidPole !== initialInputData.uuidPole) {
      appendToConsole(`$ InputData: pole uuid >> ${inputData.uuidPole}`);
      setInitialInputData({
        ...initialInputData,
        uuidPole: inputData.uuidPole,
      });
    }
    if (inputData.operationChoice !== initialInputData.operationChoice) {
      appendToConsole(
        `$ InputData: recover operation >> ${inputData.operationChoice}`,
      );
      setInitialInputData({
        ...initialInputData,
        operationChoice: inputData.operationChoice,
      });
    }
    if (inputData.willOverride !== initialInputData.willOverride) {
      if (
        inputData.taskEndpoint ===
        "/saas/tds/ajax/super/query-change-ownership-uniq/"
      ) {
        appendToConsole(
          `$ InputData: assign ownership UNIQ >> ${inputData.willOverride}`,
        );
      } else if (
        inputData.taskEndpoint ===
        "/saas/tds/ajax/super/query-postgres-version/"
      ) {
        appendToConsole(
          `$ InputData: run full db >> ${inputData.willOverride}`,
        );
      }
      setInitialInputData({
        ...initialInputData,
        willOverride: inputData.willOverride,
      });
    }
  }, [inputData]);

  // Watch for changes in taskData and append to console
  useEffect(() => {
    if (taskData.taskId !== initialTaskData.taskId) {
      appendToConsole(`$ TaskData: task id >> ${taskData.taskId}`);
      setInitialTaskData({ ...initialTaskData, taskId: taskData.taskId });
    }
    if (taskData.taskStatus !== initialTaskData.taskStatus) {
      appendToConsole(`$ TaskData: task status >> ${taskData.taskStatus}`);
      setInitialTaskData({
        ...initialTaskData,
        taskStatus: taskData.taskStatus,
      });
    }
    if (taskData.taskResult !== initialTaskData.taskResult) {
      appendToConsole(
        `$ TaskData: task result >> ${stripHtmlTags(taskData.taskResult)}`,
      );
      setInitialTaskData({
        ...initialTaskData,
        taskResult: stripHtmlTags(taskData.taskResult),
      });
    }
  }, [taskData]);

  // Watch for changes in appName and append to console
  useEffect(() => {
    if (appName !== initialAppName) {
      appendToConsole(`$ RemoteApp: initializing >> ${appName}`);
      setInitialAppName(appName);
    }
    if (
      inputData.willOverride !== initialInputData.willOverride &&
      inputData.appType === "override"
    ) {
      appendToConsole(`$ RemoteApp: !! >> will ERASE existing data`);
      setInitialInputData({
        ...initialInputData,
        willOverride: inputData.willOverride,
      });
    }
  }, [appName, setAppName]);

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
