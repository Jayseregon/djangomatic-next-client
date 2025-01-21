import { render, screen } from "@testing-library/react";
import React from "react";

// Mock auth before importing components
jest.mock(
  "../../../../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

import SaasPage from "@/app/saas/tds/lld/poles_numbering/page";

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

// Mock navigation and next-intl
jest.mock("next/navigation", () => ({
  usePathname: () => "/saas/tds/lld/poles_numbering",
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock auth components
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
      <InputDataContext.Provider value={mockContextValue}>
        {children}
      </InputDataContext.Provider>
    </div>
  ),
}));

// Mock DocLinkButton
jest.mock("@/components/docs/DocLinkButton", () => ({
  __esModule: true,
  default: ({ projectType, slug }: { projectType: string; slug: string }) => (
    <div
      data-project-type={projectType}
      data-slug={slug}
      data-testid="doc-link-button"
    >
      Doc Link
    </div>
  ),
}));

// Mock all SaaS components
jest.mock("@/components/saas/serverSelectors", () => ({
  DatabaseSchemaTable3Selector: ({
    pattern,
    tableDescription,
  }: {
    pattern: string;
    tableDescription: string;
  }) => (
    <div
      data-pattern={pattern}
      data-table-description={tableDescription}
      data-testid="database-schema-table3-selector"
    >
      Database Schema Table Selector
    </div>
  ),
}));

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

jest.mock("@/components/saas/consoleDisplay", () => ({
  ConsoleDisplay: () => <div data-testid="console-display">Console</div>,
}));

jest.mock("@/components/saas/startTaskButton", () => ({
  StartTaskButton: () => <div data-testid="start-task-button">Start Task</div>,
}));

describe("SaasTdsLldPolesNum Page", () => {
  const renderPage = async (session: any = null) => {
    const { auth } = require("../../../../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    const page = await SaasPage();

    return render(
      <InputDataContext.Provider value={mockContextValue}>
        {page}
      </InputDataContext.Provider>,
    );
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
    it("passes correct props to WithPermissionOverlay", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderPage(mockSession);
      const overlay = screen.getByTestId("permission-overlay");

      expect(overlay).toHaveAttribute("data-email", "test@example.com");
      expect(overlay).toHaveAttribute("data-permission", "canAccessAppsTdsLLD");
    });

    it("renders DocLinkButton with correct props", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderPage(mockSession);
      const docLink = screen.getByTestId("doc-link-button");

      expect(docLink).toHaveAttribute("data-project-type", "tds_docs");
      expect(docLink).toHaveAttribute("data-slug", "pole-numbering");
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

      expect(selector).toHaveAttribute("data-pattern", "*Poles*");
      expect(selector).toHaveAttribute("data-table-description", "node_p_calc");
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
        screen.getByTestId("console-display"),
      );
      expect(inputDataProvider).toContainElement(
        screen.getByTestId("start-task-button"),
      );
    });
  });
});
