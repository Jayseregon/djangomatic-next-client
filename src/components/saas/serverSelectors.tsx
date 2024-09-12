"use client";

import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

import { startTask, checkTaskStatus } from "@/lib/dbRequests";

import {
  InputDataProps,
  TaskDataProps,
  DatabaseDropdown,
  SchemasDropdown,
  TablesDropdown,
  DisplayFieldChoice,
  DisplayFieldChoiceHtml,
  DownloadButton,
} from "./serverDropdowns";

type AppType = "hld" | "lld" | "snap" | "admin" | "";

interface DatabaseSchemaTableSelectorProps {
  appType: AppType;
  pattern: string;
  nonce: string | undefined;
}

// Component for selecting a database, schema, and table
export const DatabaseSchemaTableSelector = ({
  appType,
  pattern,
  nonce,
}: DatabaseSchemaTableSelectorProps) => {
  const [inputData, setInputData] = useState<InputDataProps>({
    dbChoice: null,
    schemaChoice: null,
    tableChoice: null,
  });
  const [taskData, setTaskData] = useState<TaskDataProps>({
    taskId: null,
    taskStatus: null,
    taskResult: null,
    downloadUrl: null,
  });

  const handleTask = async () => {
    if (inputData.dbChoice && inputData.schemaChoice) {
      const task_id = await startTask({
        db_choice: inputData.dbChoice,
        schema_choice: inputData.schemaChoice,
      });

      setTaskData((prevTaskData: TaskDataProps) => ({
        ...prevTaskData,
        taskId: task_id,
      }));
    }
  };

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
      <div className="grid grid-cols-2 gap-8">
        <div className="grid grid-rows-3 gap-3">
          <DatabaseDropdown
            appType={appType}
            dbClass="db_class_spokane_valley"
            setInputData={setInputData}
          />
          <SchemasDropdown inputData={inputData} setInputData={setInputData} />
          <TablesDropdown
            inputData={inputData}
            pattern={pattern}
            setInputData={setInputData}
          />
        </div>
        <div className="grid grid-rows-3 gap-3">
          <DisplayFieldChoice fieldChoice={inputData.dbChoice} />
          <DisplayFieldChoice fieldChoice={inputData.schemaChoice} />
          <DisplayFieldChoice fieldChoice={inputData.tableChoice} />
        </div>
      </div>

      <Button
        className="bg-primary text-white min-w-96 h-10 my-3"
        radius="full"
        variant="solid"
        onClick={handleTask}
      >
        Start Task
      </Button>

      <div className="grid grid-cols-2 gap-8">
        <div className="grid grid-rows-3 gap-3">
          <DisplayFieldChoice fieldChoice="Task Status" />
          <DisplayFieldChoice fieldChoice="Task Result" />
          <DisplayFieldChoice fieldChoice="Download Url" />
        </div>
        <div className="grid grid-rows-3 gap-3">
          <DisplayFieldChoice fieldChoice={taskData.taskStatus} />
          <DisplayFieldChoiceHtml
            fieldChoice={taskData.taskResult}
            nonce={nonce}
          />
          <DownloadButton downloadUrl={taskData.downloadUrl} />
        </div>
      </div>
    </div>
  );
};
