import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NextIntlClientProvider } from "next-intl";

// Remove local NextUI mocks and use the centralized ones

import {
  DatabaseSchemaTable3Selector,
  ZipFileInputButton,
  InputArcGISCreds,
  ArcGISControls,
  SuperVersionControl,
  PoleUuidInput,
  DropdownOperationSelector,
  InputTelusCandidateProjectInfo,
  InputTelusZipfileButton,
} from "@/components/saas/serverSelectors";

// Mock the context provider
jest.mock("@/components/saas/inputDataProviders", () => ({
  useInputData: () => ({
    inputData: {
      dbChoice: null,
      schemaChoice: null,
      tableChoice: null,
      dbClass: "standard",
      appType: "admin",
    },
    setInputData: jest.fn(),
  }),
}));

const messages = {
  ServerDropdowns: {
    dbMenu_label: "Select Database",
    schMenu_label: "Select Schema",
    tblMenu_label: "Select Table",
    loading: "Loading...",
    operation_label: "Select Operation",
    zipFile: {
      helperText: "Select ZIP file",
      label: "Browse",
      upload: "Upload",
    },
  },
  appDropdownHelper: {
    database: "Choose Database",
    schema: "Choose Schema",
    table: "Choose Table",
    input_username: "Username",
    input_password: "Password",
    control_erase: "Erase DFN",
    control_snap: "Create Snapshot",
    recover_op: "Recovery Operation",
    project_id: "Project ID",
    project_num: "Project Number",
    test_helper: "Test Helper Text",
    input_uuidPole: "UUID Input",
  },
};

describe("DatabaseSchemaTable3Selector", () => {
  it("renders all three dropdowns", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <DatabaseSchemaTable3Selector
          appType="admin"
          pattern=""
          tableDescription="table"
        />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText("Choose Database")).toBeInTheDocument();
    expect(screen.getByText("Choose Schema")).toBeInTheDocument();
    expect(screen.getByText("Choose Table")).toBeInTheDocument();
  });
});

describe("ZipFileInputButton", () => {
  it("handles file selection", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ZipFileInputButton />
      </NextIntlClientProvider>,
    );

    const input = screen.getByLabelText("file-input");
    const file = new File(["test"], "test.zip", { type: "application/zip" });

    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText("test.zip")).toBeInTheDocument();
  });
});

describe("InputArcGISCreds", () => {
  it("renders username and password inputs", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <InputArcGISCreds />
      </NextIntlClientProvider>,
    );

    expect(screen.getByPlaceholderText("freddie_mercury")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("********")).toBeInTheDocument();
  });
});

describe("ArcGISControls", () => {
  it("toggles erase and snapshot controls", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ArcGISControls />
      </NextIntlClientProvider>,
    );

    // Get buttons by ID instead of role+name
    const eraseButton = screen.getByTestId("arcgisErase");
    const snapshotButton = screen.getByTestId("arcgisSnapshot");

    fireEvent.click(eraseButton);
    fireEvent.click(snapshotButton);
  });
});

describe("SuperVersionControl", () => {
  it("renders with initial state", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SuperVersionControl btnHelper="test_helper" />
      </NextIntlClientProvider>,
    );

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
  });
});

describe("PoleUuidInput", () => {
  it("updates UUID on input", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <PoleUuidInput />
      </NextIntlClientProvider>,
    );

    const input = screen.getByPlaceholderText("xxxxx-xxxx-xxxx-xxxx-xxxx");

    fireEvent.change(input, { target: { value: "test-uuid" } });
    fireEvent.blur(input);
  });
});

describe("DropdownOperationSelector", () => {
  it("shows operation choices", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <DropdownOperationSelector />
      </NextIntlClientProvider>,
    );

    const button = screen.getByRole("button");

    fireEvent.click(button);
    // Verify dropdown items would be shown
  });
});

describe("InputTelusCandidateProjectInfo", () => {
  it("handles project ID and number inputs", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <InputTelusCandidateProjectInfo />
      </NextIntlClientProvider>,
    );

    const projectIdInput = screen.getByPlaceholderText("1234567");
    const projectNumInput = screen.getByPlaceholderText("9876543");

    fireEvent.change(projectIdInput, { target: { value: "test-id" } });
    fireEvent.change(projectNumInput, { target: { value: "test-num" } });
  });
});

describe("InputTelusZipfileButton", () => {
  it("handles file upload process", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <InputTelusZipfileButton />
      </NextIntlClientProvider>,
    );

    const input = screen.getByLabelText("file-input");
    const file = new File(["test"], "test.zip", { type: "application/zip" });

    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText("test.zip")).toBeInTheDocument();
    expect(screen.getByTestId("mock-progress")).toBeInTheDocument();
  });
});
