import { render, screen } from "@testing-library/react";
import React from "react";
import { NextIntlClientProvider } from "next-intl";

import SaasPage from "@/app/saas/tds/arcgis/arcgis_api_update_db621/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/saas/tds/arcgis/arcgis_api_update_db621",
}));

// Create mock context value
const mockContextValue = {
  inputData: {},
  setInputData: jest.fn(),
  taskData: {},
  setTaskData: jest.fn(),
  consoleOutput: "",
  appendToConsole: jest.fn(),
  appName: "",
  setAppName: jest.fn(),
};

// Create InputDataContext
const InputDataContext = React.createContext(mockContextValue);

// ...existing next-intl mock...

// ...existing auth component mocks...

// Mock SaaS components
jest.mock("@/components/saas/serverSelectors", () => ({
  DatabaseSchemaTable3Selector: ({
    appType,
    endpoint,
    pattern,
    tableDescription,
  }: {
    appType: string;
    endpoint: string;
    pattern: string;
    tableDescription: string;
  }) => (
    <div
      data-app-type={appType}
      data-endpoint={endpoint}
      data-pattern={pattern}
      data-table-description={tableDescription}
      data-testid="database-schema-table3-selector"
    >
      Database Schema Table Selector
    </div>
  ),
  InputArcGISCreds: () => (
    <div data-testid="arcgis-creds">ArcGIS Credentials</div>
  ),
}));

// Mock other SaaS components with InputDataContext
jest.mock("@/components/saas/inputDataProviders", () => ({
  InputDataProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="input-data-provider">{children}</div>
  ),
  useInputData: () => mockContextValue,
  useTaskData: () => ({
    taskData: mockContextValue.taskData,
    setTaskData: mockContextValue.setTaskData,
  }),
  useConsoleData: () => ({
    consoleOutput: mockContextValue.consoleOutput,
    appendToConsole: mockContextValue.appendToConsole,
  }),
  useAppName: () => ({
    appName: mockContextValue.appName,
    setAppName: mockContextValue.setAppName,
  }),
}));

// ...existing AppPageTitle, ConsoleDisplay mocks...

// Mock auth
jest.mock(
  "../../../../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

// Update AppPageDescription mock to match page usage
jest.mock("@/components/saas/appPageDescription", () => ({
  AppPageDescription: ({ client }: { client: string }) => (
    <div data-client={client} data-testid="app-page-description">
      App Description
    </div>
  ),
}));

// Update ConsoleDisplay mock
jest.mock("@/components/saas/consoleDisplay", () => ({
  ConsoleDisplay: () => (
    <div className="console" data-testid="console-display">
      Console Output
    </div>
  ),
}));

// Update StartTaskButton mock to properly include data-testid
jest.mock("@/components/saas/startTaskButton", () => ({
  StartTaskButton: () => (
    <div className="start-task-button" data-testid="start-task-button">
      Start Task
    </div>
  ),
}));

// Update renderPage function to wrap with both providers
const renderPage = async (session: any = null) => {
  const { auth } = require("../../../../../../../auth");

  (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

  const mockMessages = {
    UnAuthorized: {
      interact: "Unauthorized interaction",
    },
    consoleDisplay: {
      label: "Console Output",
    },
    startTaskButton: {
      label: "Start Task",
    },
  };

  const page = await SaasPage();

  return render(
    <NextIntlClientProvider locale="en" messages={mockMessages}>
      <InputDataContext.Provider value={mockContextValue}>
        {page}
      </InputDataContext.Provider>
    </NextIntlClientProvider>,
  );
};

// Update the mock for WithPermissionOverlay to handle translations properly
jest.mock("@/components/auth/withPermissionOverlay", () => ({
  WithPermissionOverlay: ({
    email,
    permission,
    children,
  }: {
    email: string;
    permission: string;
    children: React.ReactNode;
  }) => (
    <InputDataContext.Provider value={mockContextValue}>
      <div
        data-email={email}
        data-permission={permission}
        data-testid="permission-overlay"
      >
        {children}
      </div>
    </InputDataContext.Provider>
  ),
}));

// Update AppPageTitle mock
jest.mock("@/components/saas/appPageTitle", () => ({
  AppPageTitle: ({ client }: { client: string }) => (
    <div data-client={client} data-testid="app-page-title">
      App Page Title
    </div>
  ),
}));

describe("SaasTdsArcgisUpdate Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Authentication", () => {
    it("shows UnAuthenticated component when no session exists", async () => {
      await renderPage(null);

      expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
      expect(
        screen.queryByTestId("permission-overlay"),
      ).not.toBeInTheDocument();
    });

    it("renders content when authenticated", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderPage(mockSession);

      expect(screen.queryByTestId("unauthenticated")).not.toBeInTheDocument();
      expect(screen.getByTestId("permission-overlay")).toBeInTheDocument();
    });
  });

  describe("Permission and Components", () => {
    it("passes correct props to WithPermissionOverlay", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderPage(mockSession);

      const overlay = screen.getByTestId("permission-overlay");

      expect(overlay).toHaveAttribute("data-email", "test@example.com");
      expect(overlay).toHaveAttribute(
        "data-permission",
        "canAccessAppsTdsArcGIS",
      );
    });

    it("renders all required components when authenticated", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderPage(mockSession);

      expect(screen.getByTestId("input-data-provider")).toBeInTheDocument();
      expect(screen.getByTestId("app-page-title")).toBeInTheDocument();
      expect(screen.getByTestId("app-page-description")).toBeInTheDocument();
      expect(
        screen.getByTestId("database-schema-table3-selector"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("arcgis-creds")).toBeInTheDocument();
      expect(screen.getByTestId("console-display")).toBeInTheDocument();
      expect(screen.getByTestId("start-task-button")).toBeInTheDocument();
    });

    it("passes correct props to components", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderPage(mockSession);

      expect(screen.getByTestId("app-page-title")).toHaveAttribute(
        "data-client",
        "tds_saas",
      );
      expect(screen.getByTestId("app-page-description")).toHaveAttribute(
        "data-client",
        "tds_saas",
      );

      const selector = screen.getByTestId("database-schema-table3-selector");

      expect(selector).toHaveAttribute("data-app-type", "snap");
      expect(selector).toHaveAttribute(
        "data-endpoint",
        "/saas/tds/ajax/query-node-dfn-pattern-list/",
      );
      expect(selector).toHaveAttribute("data-pattern", "*");
      expect(selector).toHaveAttribute("data-table-description", "dfn_table");
    });
  });

  describe("Component Layout", () => {
    it("maintains correct component hierarchy", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderPage(mockSession);

      const inputDataProvider = screen.getByTestId("input-data-provider");

      expect(inputDataProvider).toContainElement(
        screen.getByTestId("app-page-title"),
      );
      expect(inputDataProvider).toContainElement(
        screen.getByTestId("app-page-description"),
      );
      expect(inputDataProvider).toContainElement(
        screen.getByTestId("database-schema-table3-selector"),
      );
      expect(inputDataProvider).toContainElement(
        screen.getByTestId("arcgis-creds"),
      );
      expect(inputDataProvider).toContainElement(
        screen.getByTestId("console-display"),
      );
      expect(inputDataProvider).toContainElement(
        screen.getByTestId("start-task-button"),
      );
    });
  });
});
