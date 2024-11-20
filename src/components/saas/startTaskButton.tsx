"use client";

import { Button, Spinner } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";

import { startTask, checkTaskStatus } from "@/lib/dbRequests";
import {
  InputDataProps,
  startTaskProps,
  TaskDataProps,
} from "@/interfaces/lib";

import { useInputData, useTaskData } from "./inputDataProviders";
import { DownloadButton } from "./serverDropdowns";
import { useConsoleData } from "./inputDataProviders";

/**
 * Component for starting a task and displaying its status.
 * Utilizes input data, task data, and console data contexts.
 *
 * @returns {JSX.Element} The rendered component.
 */
export const StartTaskButton = (): JSX.Element => {
  const { inputData } = useInputData();
  const { taskData, setTaskData } = useTaskData();
  const { appendToConsole } = useConsoleData();
  const t = useTranslations("startTaskButton");

  // Base taskOptions
  let taskOptions: startTaskProps = {
    db_choice: inputData.dbChoice || "",
    schema_choice: inputData.schemaChoice || "",
    dbClass: inputData.dbClass,
    endpoint: inputData.taskEndpoint,
    backendUser: inputData.clientName,
  };

  // Mapping of inputData properties to taskOptions properties
  const inputToTaskOptionsMapping = [
    {
      inputKey: "file",
      taskOptionKey: "file",
      condition: (data: InputDataProps) => !!data.file,
    },
    {
      inputKey: "fileName",
      taskOptionKey: "file_path",
      condition: (data: InputDataProps) =>
        !!data.fileName && !!data.projectId && !!data.projectNum,
    },
    {
      inputKey: "projectId",
      taskOptionKey: "project_id",
      condition: (data: InputDataProps) =>
        !!data.projectId && !!data.projectNum,
    },
    {
      inputKey: "projectNum",
      taskOptionKey: "project_num",
      condition: (data: InputDataProps) =>
        !!data.projectId && !!data.projectNum,
    },
    {
      inputKey: "tdsUsername",
      taskOptionKey: "tdsUsername",
      condition: (data: InputDataProps) =>
        !!data.tdsUsername && !!data.tdsPassword,
    },
    {
      inputKey: "tdsPassword",
      taskOptionKey: "tdsPassword",
      condition: (data: InputDataProps) =>
        !!data.tdsUsername && !!data.tdsPassword,
    },
    {
      inputKey: "arcgisErase",
      taskOptionKey: "arcgisErase",
      condition: (data: InputDataProps) =>
        !!data.tdsUsername && !!data.tdsPassword,
    },
    {
      inputKey: "arcgisSnapshot",
      taskOptionKey: "arcgisSnapshot",
      condition: (data: InputDataProps) =>
        !!data.tdsUsername && !!data.tdsPassword,
    },
    {
      inputKey: "tableChoice",
      taskOptionKey: "table_choice",
      condition: (data: InputDataProps) => !!data.tableChoice,
    },
    {
      inputKey: "willOverride",
      taskOptionKey: "is_override",
      condition: (data: InputDataProps) => !!data.willOverride,
    },
    {
      inputKey: "operationChoice",
      taskOptionKey: "operationChoice",
      condition: (data: InputDataProps) => !!data.operationChoice,
    },
    {
      inputKey: "uuidPole",
      taskOptionKey: "uuidPole",
      condition: (data: InputDataProps) => !!data.uuidPole,
    },
  ];

  // Dynamically build taskOptions based on inputData and conditions
  inputToTaskOptionsMapping.forEach(
    ({ inputKey, taskOptionKey, condition }) => {
      if (condition(inputData)) {
        taskOptions = {
          ...taskOptions,
          [taskOptionKey]: inputData[inputKey as keyof InputDataProps],
        };
      }
    },
  );

  /**
   * Handles the task initiation process.
   * Sets the task as loading and starts the task with the selected database and schema choices.
   */
  const handleTask = async () => {
    if (taskOptions) {
      setTaskData((prevTaskData: TaskDataProps) => ({
        ...prevTaskData,
        isLoading: true,
      }));

      appendToConsole("$ Starting task...");
      const task_id = await startTask(taskOptions);

      setTaskData((prevTaskData: TaskDataProps) => ({
        ...prevTaskData,
        taskId: task_id,
      }));
    }
  };

  /**
   * Effect hook to check the task status periodically.
   * Triggers the checkTaskStatus function if a taskId is present.
   */
  useEffect(() => {
    if (taskData.taskId) {
      checkTaskStatus({
        task_id: taskData.taskId,
        waitTime: 1000,
        setTaskData: setTaskData,
        taskOptions: taskOptions,
        accessDownload: inputData.asDownloadable,
        backendUser: inputData.clientName,
      });
    }
  }, [taskData.taskId]);

  return (
    <div>
      <Button
        className="bg-primary text-white w-full max-w-96 h-10 my-3"
        disabled={taskData.isLoading}
        isDisabled={taskData.isLoading}
        radius="full"
        variant="solid"
        onClick={handleTask}
      >
        {taskData.isLoading ? (
          <Spinner aria-label="upload-spinner" color="white" size="sm" />
        ) : (
          t("label")
        )}
      </Button>
      {taskData.downloadUrl && (
        <div className="pt-3">
          <DownloadButton downloadUrl={taskData.downloadUrl} />
        </div>
      )}
    </div>
  );
};
