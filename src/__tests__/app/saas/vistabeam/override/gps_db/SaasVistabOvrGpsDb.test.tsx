import { render, screen } from "@testing-library/react";
import React from "react";

import SaasPage from "@/app/saas/vistabeam/override/gps_db/page";

// Create the context value outside of the mock
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

// Create InputDataContext outside of the mock
const InputDataContext = React.createContext(mockContextValue);

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/saas/vistabeam/override/gps_db",
}));

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

// Mock SaaS components
jest.mock("@/components/saas/serverSelectors", () => ({
  DatabaseSchema2Selector: ({ appType }: { appType?: string }) => (
    <div data-app-type={appType} data-testid="database-schema-selector">
      Database Schema Selector
    </div>
  ),
  ZipFileInputButton: () => (
    <div data-testid="zipfile-input">Zip File Input</div>
  ),
}));

// Mock inputDataProviders
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

// Update mock for appPageTitle
jest.mock("@/components/saas/appPageTitle", () => ({
  AppPageTitle: ({ client }: { client: string }) => (
    <div data-client={client} data-testid="app-page-title">
      App Page Title
    </div>
  ),
}));

jest.mock("@/components/saas/appPageDescription", () => ({
  AppPageDescription: ({
    client,
    targetTranslation,
  }: {
    client: string;
    targetTranslation: string;
  }) => (
    <div
      data-client={client}
      data-testid="app-page-description"
      data-translation={targetTranslation}
    >
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

// Update ConsoleDisplay mock to include data-testid
jest.mock("@/components/saas/consoleDisplay", () => ({
  ConsoleDisplay: () => <div data-testid="console-display">Console</div>,
}));

// Update StartTaskButton mock to include data-testid
jest.mock("@/components/saas/startTaskButton", () => ({
  StartTaskButton: () => <div data-testid="start-task-button">Start Task</div>,
}));

describe("SaasVistabeamOverrideGpsDb Page", () => {
  const renderPage = async (session: any = null) => {
    const { auth } = require("../../../../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await SaasPage());
  };

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
    it("passes correct props to WithPermissionOverlay with override permission", async () => {
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
        "canAccessAppsVistabeamOverride",
      );
    });

    it("renders DatabaseSchema2Selector with correct appType prop", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderPage(mockSession);

      const selector = screen.getByTestId("database-schema-selector");

      expect(selector).toHaveAttribute("data-app-type", "hld");
    });

    it("renders all required components when authenticated", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderPage(mockSession);

      // Check for presence of all main components
      expect(screen.getByTestId("input-data-provider")).toBeInTheDocument();
      expect(screen.getByTestId("app-page-title")).toBeInTheDocument();
      expect(screen.getByTestId("app-page-description")).toBeInTheDocument();
      expect(screen.getByTestId("zipfile-input")).toBeInTheDocument();
      expect(
        screen.getByTestId("database-schema-selector"),
      ).toBeInTheDocument();
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
        "vistabeam_saas",
      );
      expect(screen.getByTestId("app-page-description")).toHaveAttribute(
        "data-client",
        "vistabeam_saas",
      );
      expect(screen.getByTestId("app-page-description")).toHaveAttribute(
        "data-translation",
        "vistambeamApps",
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
        screen.getByTestId("zipfile-input"),
      );
      expect(inputDataProvider).toContainElement(
        screen.getByTestId("database-schema-selector"),
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
