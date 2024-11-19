"use client";

import { Button, Spinner } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";

import { startTask, checkTaskStatus } from "@/lib/dbRequests";
import { startTaskProps, TaskDataProps } from "@/interfaces/lib";

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

  let taskOptions: startTaskProps = {
    db_choice: inputData.dbChoice || "",
    schema_choice: inputData.schemaChoice || "",
    dbClass: inputData.dbClass,
    endpoint: inputData.taskEndpoint,
    backendUser: inputData.clientName,
  };

  if (inputData.file) {
    taskOptions = {
      ...taskOptions,
      file: inputData.file,
    };
  }

  if (inputData.tdsUsername && inputData.tdsPassword) {
    taskOptions = {
      ...taskOptions,
      tdsUsername: inputData.tdsUsername,
      tdsPassword: inputData.tdsPassword,
      arcgisErase: inputData.arcgisErase,
      arcgisSnapshot: inputData.arcgisSnapshot,
    };
  }

  if (inputData.projectId && inputData.projectNum) {
    taskOptions = {
      ...taskOptions,
      project_id: inputData.projectId,
      project_num: inputData.projectNum,
    };
  }

  if (inputData.tableChoice) {
    taskOptions = {
      ...taskOptions,
      table_choice: inputData.tableChoice,
    };
  }

  if (inputData.willOverride) {
    taskOptions = {
      ...taskOptions,
      is_override: inputData.willOverride,
    };
  }

  if (inputData.operationChoice) {
    taskOptions = {
      ...taskOptions,
      operationChoice: inputData.operationChoice,
    };
  }

  if (inputData.uuidPole) {
    taskOptions = {
      ...taskOptions,
      uuidPole: inputData.uuidPole,
    };
  }

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
