import React from "react";
import { render, screen, act } from "@testing-library/react";

import "@testing-library/jest-dom";
import {
  InputDataProvider,
  useInputData,
  useTaskData,
  useAppName,
  useConsoleData,
} from "@/components/saas/inputDataProviders";

// Helper components to access each custom hook:
function TestInputData() {
  const { inputData, setInputData } = useInputData();

  return (
    <>
      <div data-testid="dbChoice">{inputData.dbChoice}</div>
      <div data-testid="schemaChoice">{inputData.schemaChoice}</div>
      <div data-testid="tableChoice">{inputData.tableChoice}</div>
      <div data-testid="appType">{inputData.appType}</div>
      <div data-testid="dbClass">{inputData.dbClass}</div>
      <div data-testid="clientName">{inputData.clientName}</div>
      <div data-testid="taskEndpoint">{inputData.taskEndpoint}</div>
      <div data-testid="asDownloadable">{String(inputData.asDownloadable)}</div>
      <div data-testid="willOverride">{String(inputData.willOverride)}</div>
      <div data-testid="operationChoice">{inputData.operationChoice}</div>
      <div data-testid="uuidPole">{inputData.uuidPole}</div>
      <div data-testid="file">{inputData.file?.name}</div>
      <div data-testid="fileName">{inputData.fileName}</div>
      <div data-testid="tdsUsername">{inputData.tdsUsername}</div>
      <div data-testid="tdsPassword">{inputData.tdsPassword}</div>
      <div data-testid="arcgisErase">{String(inputData.arcgisErase)}</div>
      <div data-testid="arcgisSnapshot">{String(inputData.arcgisSnapshot)}</div>
      <div data-testid="projectId">{inputData.projectId}</div>
      <div data-testid="projectNum">{inputData.projectNum}</div>
      <button
        data-testid="setDbChoice"
        onClick={() =>
          setInputData((d) => ({
            ...d,
            dbChoice: "postgres",
            schemaChoice: "public",
            tableChoice: "users",
            dbClass: "standard",
            appType: "web",
            clientName: "testClient",
            taskEndpoint: "/api/task",
            asDownloadable: true,
            willOverride: false,
            operationChoice: "create",
            uuidPole: "id",
            file: new File([""], "test.csv"),
            fileName: "test.csv",
            tdsUsername: "testuser",
            tdsPassword: "testpass",
            arcgisErase: true,
            arcgisSnapshot: false,
            projectId: "proj123",
            projectNum: "456",
          }))
        }
      >
        Set dbChoice & schemaChoice
      </button>
    </>
  );
}

function TestTaskData() {
  const { taskData, setTaskData } = useTaskData();

  return (
    <>
      <div data-testid="taskId">{taskData.taskId}</div>
      <div data-testid="taskStatus">{taskData.taskStatus}</div>
      <div data-testid="taskResult">{taskData.taskResult}</div>
      <div data-testid="downloadUrl">{taskData.downloadUrl}</div>
      <div data-testid="isLoading">{String(taskData.isLoading)}</div>
      <button
        data-testid="setTaskData"
        onClick={() =>
          setTaskData((t) => ({
            ...t,
            taskId: "12345",
            taskStatus: "running",
            taskResult: "Task is running",
            downloadUrl: "http://example.com/file.zip",
            isLoading: true,
          }))
        }
      >
        Set Task Data
      </button>
    </>
  );
}

function TestAppName() {
  const { appName, setAppName } = useAppName();

  return (
    <>
      <div data-testid="appName">{appName}</div>
      <button data-testid="setAppName" onClick={() => setAppName("MyTestApp")}>
        Set AppName
      </button>
    </>
  );
}

function TestConsoleData() {
  const { consoleOutput, appendToConsole } = useConsoleData();

  return (
    <>
      <div data-testid="consoleOutput">{consoleOutput}</div>
      <button
        data-testid="appendConsole"
        onClick={() => appendToConsole("New line")}
      >
        Append Console
      </button>
    </>
  );
}

describe("InputDataProvider", () => {
  it("provides default inputData", () => {
    render(
      <InputDataProvider>
        <TestInputData />
      </InputDataProvider>,
    );
    expect(screen.getByTestId("dbChoice").textContent).toBe("");
  });

  it("updates inputData via setInputData", () => {
    render(
      <InputDataProvider>
        <TestInputData />
      </InputDataProvider>,
    );
    act(() => {
      screen.getByTestId("setDbChoice").click();
    });
    expect(screen.getByTestId("dbChoice").textContent).toBe("postgres");
  });

  it("provides default taskData and updates it", () => {
    render(
      <InputDataProvider>
        <TestTaskData />
      </InputDataProvider>,
    );
    expect(screen.getByTestId("taskStatus").textContent).toBe("");
    act(() => {
      screen.getByTestId("setTaskData").click();
    });
    expect(screen.getByTestId("taskStatus").textContent).toBe("running");
  });

  it("provides default appName and updates it", () => {
    render(
      <InputDataProvider>
        <TestAppName />
      </InputDataProvider>,
    );
    expect(screen.getByTestId("appName").textContent).toBe("");
    act(() => {
      screen.getByTestId("setAppName").click();
    });
    expect(screen.getByTestId("appName").textContent).toBe("MyTestApp");
  });

  it("provides consoleOutput and appends new lines", () => {
    render(
      <InputDataProvider>
        <TestConsoleData />
      </InputDataProvider>,
    );
    expect(screen.getByTestId("consoleOutput").textContent).toBe("");
    act(() => {
      screen.getByTestId("appendConsole").click();
    });
    expect(screen.getByTestId("consoleOutput").textContent).toContain(
      "New line",
    );
  });

  it("sets multiple fields in InputDataProps", () => {
    render(
      <InputDataProvider>
        <TestInputData />
      </InputDataProvider>,
    );
    expect(screen.getByTestId("dbChoice").textContent).toBe("");
    expect(screen.getByTestId("schemaChoice").textContent).toBe("");
    expect(screen.getByTestId("tableChoice").textContent).toBe("");
    expect(screen.getByTestId("appType").textContent).toBe("");
    expect(screen.getByTestId("dbClass").textContent).toBe("");
    expect(screen.getByTestId("clientName").textContent).toBe("");
    expect(screen.getByTestId("taskEndpoint").textContent).toBe("");
    expect(screen.getByTestId("asDownloadable").textContent).toBe("false");
    expect(screen.getByTestId("willOverride").textContent).toBe("false");
    expect(screen.getByTestId("operationChoice").textContent).toBe("");
    expect(screen.getByTestId("uuidPole").textContent).toBe("");
    expect(screen.getByTestId("file").textContent).toBe("");
    expect(screen.getByTestId("fileName").textContent).toBe("");
    expect(screen.getByTestId("tdsUsername").textContent).toBe("");
    expect(screen.getByTestId("tdsPassword").textContent).toBe("");
    expect(screen.getByTestId("arcgisErase").textContent).toBe("false");
    expect(screen.getByTestId("arcgisSnapshot").textContent).toBe("false");
    expect(screen.getByTestId("projectId").textContent).toBe("");
    expect(screen.getByTestId("projectNum").textContent).toBe("");
    act(() => {
      screen.getByTestId("setDbChoice").click();
    });
    expect(screen.getByTestId("dbChoice").textContent).toBe("postgres");
    expect(screen.getByTestId("schemaChoice").textContent).toBe("public");
    expect(screen.getByTestId("tableChoice").textContent).toBe("users");
    expect(screen.getByTestId("appType").textContent).toBe("web");
    expect(screen.getByTestId("dbClass").textContent).toBe("standard");
    expect(screen.getByTestId("clientName").textContent).toBe("testClient");
    expect(screen.getByTestId("taskEndpoint").textContent).toBe("/api/task");
    expect(screen.getByTestId("asDownloadable").textContent).toBe("true");
    expect(screen.getByTestId("willOverride").textContent).toBe("false");
    expect(screen.getByTestId("operationChoice").textContent).toBe("create");
    expect(screen.getByTestId("uuidPole").textContent).toBe("id");
    expect(screen.getByTestId("file").textContent).toBe("test.csv");
    expect(screen.getByTestId("fileName").textContent).toBe("test.csv");
    expect(screen.getByTestId("tdsUsername").textContent).toBe("testuser");
    expect(screen.getByTestId("tdsPassword").textContent).toBe("testpass");
    expect(screen.getByTestId("arcgisErase").textContent).toBe("true");
    expect(screen.getByTestId("arcgisSnapshot").textContent).toBe("false");
    expect(screen.getByTestId("projectId").textContent).toBe("proj123");
    expect(screen.getByTestId("projectNum").textContent).toBe("456");
  });

  it("sets multiple fields in TaskDataProps", () => {
    render(
      <InputDataProvider>
        <TestTaskData />
      </InputDataProvider>,
    );
    expect(screen.getByTestId("taskId").textContent).toBe("");
    expect(screen.getByTestId("taskStatus").textContent).toBe("");
    expect(screen.getByTestId("taskResult").textContent).toBe("");
    expect(screen.getByTestId("downloadUrl").textContent).toBe("");
    expect(screen.getByTestId("isLoading").textContent).toBe("false");
    act(() => {
      screen.getByTestId("setTaskData").click();
    });
    expect(screen.getByTestId("taskId").textContent).toBe("12345");
    expect(screen.getByTestId("taskStatus").textContent).toBe("running");
    expect(screen.getByTestId("taskResult").textContent).toBe(
      "Task is running",
    );
    expect(screen.getByTestId("downloadUrl").textContent).toBe(
      "http://example.com/file.zip",
    );
    expect(screen.getByTestId("isLoading").textContent).toBe("true");
  });
});
