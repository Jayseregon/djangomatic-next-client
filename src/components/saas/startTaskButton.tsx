"use client";

import { Button, Spinner } from "@nextui-org/react";
import React, { useEffect } from "react";

import { startTask, checkTaskStatus } from "@/lib/dbRequests";

import { useInputData, useTaskData } from "./inputDataProviders";
import { TaskDataProps } from "./serverDropdowns";
import { DownloadButton } from "./serverDropdowns";
import { useConsoleData } from "./inputDataProviders";

/**
 * Component for starting a task and displaying its status.
 * Utilizes input data, task data, and console data contexts.
 *
 * @param {object} props - The props for the component.
 * @param {string} props.taskEndpoint - The endpoint to start the task.
 * @returns {JSX.Element} The rendered component.
 */
export const StartTaskButton = ({
  taskEndpoint,
}: {
  taskEndpoint: string;
}): JSX.Element => {
  const { inputData } = useInputData();
  const { taskData, setTaskData } = useTaskData();
  const { appendToConsole } = useConsoleData();

  /**
   * Handles the task initiation process.
   * Sets the task as loading and starts the task with the selected database and schema choices.
   */
  const handleTask = async () => {
    if (inputData.dbChoice && inputData.schemaChoice) {
      setTaskData((prevTaskData: TaskDataProps) => ({
        ...prevTaskData,
        isLoading: true,
      }));
      appendToConsole("$ Starting task...");
      const task_id = await startTask({
        db_choice: inputData.dbChoice,
        schema_choice: inputData.schemaChoice,
        endpoint: taskEndpoint,
      });

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
        accessDownload: true,
      });
    }
  }, [taskData.taskId]);

  return (
    <div>
      <Button
        className="bg-primary text-white min-w-96 h-10 my-3"
        disabled={taskData.isLoading}
        isDisabled={taskData.isLoading}
        radius="full"
        variant="solid"
        onClick={handleTask}
      >
        {taskData.isLoading ? (
          <Spinner aria-label="upload-spinner" color="white" size="sm" />
        ) : (
          "Start Task"
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
