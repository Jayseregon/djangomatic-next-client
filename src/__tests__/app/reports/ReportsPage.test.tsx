import { render, screen } from "@testing-library/react";

import ReportsPage from "@/app/reports/page";

// Mock UnAuthenticated component
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <div data-testid="unauthenticated">Not authenticated</div>
  ),
}));

// Mock DashboardManager component - Fixed import path by removing /src/
jest.mock("@/components/reports/DashboardManager", () => ({
  DashboardManager: ({ email }: { email: string }) => (
    <div data-email={email} data-testid="dashboard-manager">
      Dashboard Manager
    </div>
  ),
}));

// Mock auth
jest.mock(
  "../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

describe("ReportsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderReportsPage = async (session: any = null) => {
    const { auth } = require("../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await ReportsPage());
  };

  it("shows UnAuthenticated component when no session exists", async () => {
    await renderReportsPage(null);

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-manager")).not.toBeInTheDocument();
  });

  it("renders DashboardManager when user is authenticated", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
      },
    };

    await renderReportsPage(mockSession);

    const dashboardManager = screen.getByTestId("dashboard-manager");

    expect(dashboardManager).toBeInTheDocument();
    expect(dashboardManager).toHaveAttribute("data-email", "test@example.com");
    expect(screen.queryByTestId("unauthenticated")).not.toBeInTheDocument();
  });

  it("handles undefined session as unauthenticated", async () => {
    await renderReportsPage(undefined);

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-manager")).not.toBeInTheDocument();
  });

  it("handles invalid session format gracefully", async () => {
    const invalidSession = {}; // Empty object to simulate invalid session

    await renderReportsPage(invalidSession);

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-manager")).not.toBeInTheDocument();
  });

  // Add more specific test cases for different invalid session scenarios
  it.each([
    [{ user: null }],
    [{ user: {} }],
    [{ user: { email: null } }],
    [{ user: { email: undefined } }],
    [{}],
  ])("handles invalid session format: %p", async (invalidSession) => {
    await renderReportsPage(invalidSession);

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-manager")).not.toBeInTheDocument();
  });

  it("passes email correctly to DashboardManager", async () => {
    const mockSession = {
      user: {
        email: "user@test.com",
      },
    };

    await renderReportsPage(mockSession);

    const dashboardManager = screen.getByTestId("dashboard-manager");

    expect(dashboardManager).toHaveAttribute("data-email", "user@test.com");
  });
});
