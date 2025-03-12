import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NextIntlClientProvider } from "next-intl";

import { TaskDataProps, InputDataProps } from "@/interfaces/lib";
import { StartTaskButton } from "@/components/saas/startTaskButton";
import * as dbRequests from "@/lib/dbRequests";

// Mock the dbRequests functions
jest.mock("@/lib/dbRequests", () => ({
  startTask: jest.fn(),
  checkTaskStatus: jest.fn(),
}));

jest.mock("@/actions/prisma/tracking/action", () => ({
  createAppTrackingEntry: jest.fn().mockResolvedValue("test-entry-id"),
  updateAppTrackingEntry: jest.fn().mockResolvedValue(undefined),
}));

// Create a properly typed mockState object
interface MockState {
  inputData: InputDataProps;
  taskData: TaskDataProps;
  setTaskData: jest.Mock;
  appendToConsole: jest.Mock;
}

let mockState: MockState = {
  inputData: {
    dbChoice: "test_db",
    schemaChoice: "public",
    dbClass: "standard",
    taskEndpoint: "/api/task",
    clientName: "testUser",
    asDownloadable: true,
    tableChoice: null,
    appType: undefined,
    willOverride: false,
  },
  taskData: {
    taskId: null,
    taskStatus: null,
    taskResult: null,
    downloadUrl: null,
    isLoading: false,
  },
  setTaskData: jest.fn(),
  appendToConsole: jest.fn(),
};

// Update the mock to use the mockState
jest.mock("@/components/saas/inputDataProviders", () => ({
  useInputData: () => ({
    inputData: mockState.inputData,
  }),
  useAppName: () => ({
    appName: "testApp",
  }),
  useTaskData: () => ({
    taskData: mockState.taskData,
    setTaskData: mockState.setTaskData,
  }),
  useConsoleData: () => ({
    appendToConsole: mockState.appendToConsole,
  }),
}));

const messages = {
  startTaskButton: {
    label: "Start Task",
  },
};

describe("StartTaskButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mockState to default values with proper types
    mockState = {
      inputData: {
        dbChoice: "test_db",
        schemaChoice: "public",
        dbClass: "standard",
        taskEndpoint: "/api/task",
        clientName: "testUser",
        asDownloadable: true,
        tableChoice: null,
        appType: undefined,
        willOverride: false,
      },
      taskData: {
        taskId: null,
        taskStatus: null,
        taskResult: null,
        downloadUrl: null,
        isLoading: false,
      },
      setTaskData: jest.fn(),
      appendToConsole: jest.fn(),
    };
  });

  it("renders start task button", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <StartTaskButton />
      </NextIntlClientProvider>,
    );

    // Button text is rendered as "label" because of our mock
    expect(screen.getByText("label")).toBeInTheDocument();
  });

  it("starts task when clicked", async () => {
    (dbRequests.startTask as jest.Mock).mockResolvedValueOnce("task123");

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <StartTaskButton />
      </NextIntlClientProvider>,
    );

    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    expect(dbRequests.startTask).toHaveBeenCalledWith(
      expect.objectContaining({
        db_choice: "test_db",
        schema_choice: "public",
        dbClass: "standard",
        endpoint: "/api/task",
        backendUser: "testUser",
      }),
    );
  });

  it("shows loading spinner while task is running", async () => {
    (dbRequests.startTask as jest.Mock).mockResolvedValueOnce("task123");

    const { rerender } = render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <StartTaskButton />
      </NextIntlClientProvider>,
    );

    const button = screen.getByRole("button");

    await act(async () => {
      fireEvent.click(button);
    });

    // Set loading state
    mockState.taskData.isLoading = true;

    rerender(
      <NextIntlClientProvider locale="en" messages={messages}>
        <StartTaskButton />
      </NextIntlClientProvider>,
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("shows download button when task completes with downloadable result", async () => {
    (dbRequests.startTask as jest.Mock).mockResolvedValueOnce("task123");

    const { rerender } = render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <StartTaskButton />
      </NextIntlClientProvider>,
    );

    // Set completed state with download URL
    mockState.taskData = {
      taskId: "task123",
      taskStatus: "SUCCESS",
      taskResult: "Task completed",
      downloadUrl: "http://example.com/file.zip",
      isLoading: false,
    };

    rerender(
      <NextIntlClientProvider locale="en" messages={messages}>
        <StartTaskButton />
      </NextIntlClientProvider>,
    );

    // Look for specific Download button by its text
    expect(screen.getByText("Download")).toBeInTheDocument();
  });
});
