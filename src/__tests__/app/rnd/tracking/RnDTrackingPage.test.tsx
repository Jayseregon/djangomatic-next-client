import { render, screen } from "@testing-library/react";

import AppTrackingSidePage from "@/app/rnd/tracking/page";

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

jest.mock("@/src/components/rnd/tracking/AppTrackingBoard", () => ({
  AppTrackingBoard: () => (
    <div data-testid="app-tracking-board">App Tracking Board Component</div>
  ),
}));

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

    expect(screen.getByText("App Usage Tracking")).toBeInTheDocument();
    expect(
      screen.getByText("Track application usage statistics"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("app-tracking-board")).toBeInTheDocument();
    expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
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

    it("includes ErrorBoundary with fallback message", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
          name: "Test User",
        },
      };

      await renderTrackingPage(mockSession);

      const errorBoundary = screen.getByTestId("error-boundary");

      expect(errorBoundary).toBeInTheDocument();
      expect(errorBoundary).toHaveAttribute("data-fallback", "component");
    });

    it("renders AppTrackingBoard inside ErrorBoundary", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
          name: "Test User",
        },
      };

      await renderTrackingPage(mockSession);

      const errorBoundary = screen.getByTestId("error-boundary");
      const trackingBoard = screen.getByTestId("app-tracking-board");

      expect(errorBoundary).toContainElement(trackingBoard);
    });
  });
});
