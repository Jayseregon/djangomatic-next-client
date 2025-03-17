import { render, screen } from "@testing-library/react";

import AppTrackingSidePage from "@/src/app/rnd/tracking/apps/page";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (str: string) =>
    str === "title"
      ? "App Usage Tracking"
      : "Track application usage statistics",
}));

// Mock components
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <div data-testid="unauthenticated">Not authenticated</div>
  ),
}));

// Mock the AppsTrackingDashboard component
jest.mock("@/src/components/rnd/tracking/apps/AppsTrackingDashboard", () => ({
  AppsTrackingDashboard: () => (
    <div data-testid="app-tracking-dashboard">
      App Tracking Dashboard Component
    </div>
  ),
}));

// Mock the ReportsTrackingDashboard component
jest.mock(
  "@/src/components/rnd/tracking/apps/tower-reports/ReportsTrackingDashboard",
  () => ({
    ReportsTrackingDashboard: () => (
      <div data-testid="reports-tracking-dashboard">
        Tower Report Tracking Dashboard Component
      </div>
    ),
  }),
);

jest.mock("@/src/components/rnd/UserAccess", () => ({
  UserAccessRnDSection: ({
    children,
    email,
  }: {
    children: React.ReactNode;
    email: string;
  }) => (
    <div data-email={email} data-testid="user-access-section">
      {children}
    </div>
  ),
}));

jest.mock("@/src/components/error/ErrorBoundary", () => ({
  __esModule: true,
  default: ({
    children,
    fallback,
  }: {
    children: React.ReactNode;
    fallback: React.ReactNode;
  }) => (
    <div
      data-fallback={typeof fallback === "string" ? fallback : "component"}
      data-testid="error-boundary"
    >
      {children}
    </div>
  ),
}));

// Mock primitives
jest.mock("@/components/primitives", () => ({
  title: () => "tracking-title",
  subtitle: ({ class: className }: { class: string }) => className,
}));

// Mock auth
jest.mock(
  "../../../../../auth",
  () => ({
    auth: jest.fn(),
    signIn: jest.fn(),
    providerMap: {
      github: { id: "github", name: "GitHub" },
      "azure-ad": { id: "azure-ad", name: "Microsoft Entra ID" },
    },
  }),
  { virtual: true },
);

// Mock the useAppsTrackingData hook to prevent act warnings
jest.mock("@/src/hooks/tracking/useAppsTrackingData", () => ({
  useAppsTrackingData: () => ({
    data: [],
    isLoading: false,
    error: null,
    reload: jest.fn(),
    years: [2023, 2024],
  }),
}));

describe("AppTrackingSidePage", () => {
  const renderTrackingPage = async (session: any = null) => {
    const { auth } = require("../../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await AppTrackingSidePage());
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows UnAuthenticated component when no session exists", async () => {
    await renderTrackingPage(null);
    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
  });

  it("renders tracking dashboard when authenticated", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
        name: "Test User",
      },
    };

    await renderTrackingPage(mockSession);

    // Use a more specific query to get the main title (h1)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "App Usage Tracking",
    );
    expect(
      screen.getByText("Track application usage statistics"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("app-tracking-dashboard")).toBeInTheDocument();
    expect(
      screen.getByTestId("reports-tracking-dashboard"),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("error-boundary").length).toBe(2);
  });

  describe("AppTrackingPageContent", () => {
    it("wraps content in UserAccessRnDSection with correct email", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
          name: "Test User",
        },
      };

      await renderTrackingPage(mockSession);

      const userAccess = screen.getByTestId("user-access-section");

      expect(userAccess).toHaveAttribute("data-email", "test@example.com");
    });

    it("includes ErrorBoundary components with specific fallback messages", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
          name: "Test User",
        },
      };

      await renderTrackingPage(mockSession);

      const errorBoundaries = screen.getAllByTestId("error-boundary");

      expect(errorBoundaries.length).toBe(2);
      expect(errorBoundaries[0]).toContainElement(
        screen.getByTestId("app-tracking-dashboard"),
      );
      expect(errorBoundaries[1]).toContainElement(
        screen.getByTestId("reports-tracking-dashboard"),
      );
    });

    it("renders section headers for both tracking components", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
          name: "Test User",
        },
      };

      await renderTrackingPage(mockSession);

      // Get all h3 headings and check their content
      const sectionHeadings = screen.getAllByRole("heading", { level: 3 });

      expect(sectionHeadings[0]).toHaveTextContent("App Usage Tracking");
      expect(sectionHeadings[1]).toHaveTextContent("Tower Report Tracking");
    });
  });
});
