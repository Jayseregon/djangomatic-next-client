import { render, screen } from "@testing-library/react";

import SaasPage from "@/app/saas/telus/admin/pole_candidates/page";

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

jest.mock("@/components/saas/serverSelectors", () => ({
  InputTelusZipfileButton: () => (
    <div data-testid="input-telus-zipfile">Zipfile Input</div>
  ),
  InputTelusCandidateProjectInfo: () => (
    <div data-testid="input-telus-project-info">Project Info Input</div>
  ),
}));

jest.mock("@/components/saas/inputDataProviders", () => ({
  InputDataProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="input-data-provider">{children}</div>
  ),
}));

jest.mock("@/components/saas/consoleDisplay", () => ({
  ConsoleDisplay: () => <div data-testid="console-display">Console</div>,
}));

jest.mock("@/components/saas/startTaskButton", () => ({
  StartTaskButton: () => <div data-testid="start-task-button">Start Task</div>,
}));

// Mock auth
jest.mock(
  "../../../../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

describe("SaasTelusAdminPoleCandidates Page", () => {
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
        "canAccessAppsTelusAdmin",
      );
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
      expect(screen.getByTestId("input-telus-zipfile")).toBeInTheDocument();
      expect(
        screen.getByTestId("input-telus-project-info"),
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
        "telus_saas",
      );
      expect(screen.getByTestId("app-page-description")).toHaveAttribute(
        "data-client",
        "telus_saas",
      );
      expect(screen.getByTestId("app-page-description")).toHaveAttribute(
        "data-translation",
        "telusApps",
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
        screen.getByTestId("input-telus-zipfile"),
      );
      expect(inputDataProvider).toContainElement(
        screen.getByTestId("input-telus-project-info"),
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
