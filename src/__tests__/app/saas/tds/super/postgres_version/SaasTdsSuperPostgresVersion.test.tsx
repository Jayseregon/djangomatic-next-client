import { render, screen } from "@testing-library/react";
import React from "react";
import { NextIntlClientProvider } from "next-intl";

import SaasPage from "@/app/saas/tds/super/postgres_version/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/saas/tds/super/postgres_version",
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

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock auth components and permission overlay
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
  DatabaseSchema2Selector: () => (
    <div data-testid="database-schema-selector">Database Schema Selector</div>
  ),
  SuperVersionControl: ({ btnHelper }: { btnHelper: string }) => (
    <div data-btn-helper={btnHelper} data-testid="super-version-control">
      Super Version Control
    </div>
  ),
}));

// Mock other SaaS components with context
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

// Mock AppPageTitle and AppPageDescription
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

// Mock ConsoleDisplay and StartTaskButton
jest.mock("@/components/saas/consoleDisplay", () => ({
  ConsoleDisplay: () => (
    <div className="console" data-testid="console-display">
      Console Output
    </div>
  ),
}));

jest.mock("@/components/saas/startTaskButton", () => ({
  StartTaskButton: () => (
    <div className="start-task-button" data-testid="start-task-button">
      Start Task
    </div>
  ),
}));

// Mock auth with full auth implementation
jest.mock(
  "../../../../../../../auth",
  () => ({
    auth: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    providers: {
      github: { id: "github", name: "GitHub" },
      "azure-ad": { id: "azure-ad", name: "Microsoft Entra ID" },
    },
  }),
  { virtual: true },
);

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
      {page}
    </NextIntlClientProvider>,
  );
};

describe("SaasTdsSuperPostgresVersion Page", () => {
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
        "canAccessAppsTdsSuper",
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
        screen.getByTestId("database-schema-selector"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("super-version-control")).toBeInTheDocument();
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

      // Check SuperVersionControl specific props
      expect(screen.getByTestId("super-version-control")).toHaveAttribute(
        "data-btn-helper",
        "version_full_db",
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
        screen.getByTestId("database-schema-selector"),
      );
      expect(inputDataProvider).toContainElement(
        screen.getByTestId("super-version-control"),
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
