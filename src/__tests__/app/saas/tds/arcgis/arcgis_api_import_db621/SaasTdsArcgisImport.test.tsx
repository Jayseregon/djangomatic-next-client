import { render, screen } from "@testing-library/react";
import React from "react";

import SaasPage from "@/app/saas/tds/arcgis/arcgis_api_import_db621/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/saas/tds/arcgis/arcgis_api_import_db621",
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

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock components
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <div data-testid="unauthenticated">Not authenticated</div>
  ),
}));

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
    <div
      data-email={email}
      data-permission={permission}
      data-testid="permission-overlay"
    >
      {children}
    </div>
  ),
}));

// Mock SaaS components with ArcGIS specific components
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
  ArcGISControls: () => (
    <div data-testid="arcgis-controls">ArcGIS Controls</div>
  ),
}));

// Mock other SaaS components with proper context
jest.mock("@/components/saas/inputDataProviders", () => ({
  InputDataProvider: ({ children }: { children: React.ReactNode }) => (
    <InputDataContext.Provider value={mockContextValue}>
      <div data-testid="input-data-provider">{children}</div>
    </InputDataContext.Provider>
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

jest.mock("@/components/saas/appPageTitle", () => ({
  AppPageTitle: ({ client }: { client: string }) => (
    <div data-client={client} data-testid="app-page-title">
      App Page Title
    </div>
  ),
}));

jest.mock("@/components/saas/appPageDescription", () => ({
  AppPageDescription: ({ client }: { client: string }) => (
    <div data-client={client} data-testid="app-page-description">
      App Description
    </div>
  ),
}));

// Mock auth
jest.mock(
  "../../../../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

// Update ConsoleDisplay mock to include proper data-testid
jest.mock("@/components/saas/consoleDisplay", () => ({
  ConsoleDisplay: () => (
    <div className="console" data-testid="console-display">
      Console Output
    </div>
  ),
}));

jest.mock("@/components/saas/startTaskButton", () => ({
  StartTaskButton: () => <div data-testid="start-task-button">Start Task</div>,
}));

describe("SaasTdsArcgisImport Page", () => {
  const renderPage = async (session: any = null) => {
    const { auth } = require("../../../../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await SaasPage());
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Authentication", () => {
    // ...existing authentication tests...
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
      expect(screen.getByTestId("arcgis-controls")).toBeInTheDocument();
      expect(screen.getByTestId("console-display")).toBeInTheDocument();
      expect(screen.getByTestId("start-task-button")).toBeInTheDocument();
    });

    it("passes correct props to DatabaseSchemaTable3Selector", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderPage(mockSession);

      const selector = screen.getByTestId("database-schema-table3-selector");

      expect(selector).toHaveAttribute("data-app-type", "lld");
      expect(selector).toHaveAttribute(
        "data-endpoint",
        "/saas/tds/ajax/query-node-dfn-pattern-list/",
      );
      expect(selector).toHaveAttribute("data-pattern", "*");
      expect(selector).toHaveAttribute("data-table-description", "dfn_table");
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
        screen.getByTestId("arcgis-controls"),
      );
      expect(inputDataProvider).toContainElement(
        screen.getByTestId("console-display"),
      );
      expect(inputDataProvider).toContainElement(
        screen.getByTestId("start-task-button"),
      );
    });

    it("renders ArcGIS components in flex container", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderPage(mockSession);

      const arcgisContainer = screen.getByTestId("arcgis-creds").parentElement;

      expect(arcgisContainer).toHaveClass("flex", "gap-3");
      expect(arcgisContainer).toContainElement(
        screen.getByTestId("arcgis-controls"),
      );
    });
  });
});
