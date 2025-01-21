import { render, screen } from "@testing-library/react";

import AdminPage from "@/app/admin/page";

// Mock components
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <div data-testid="unauthenticated">Not authenticated</div>
  ),
}));

// Fix: Change @/src/components/admin/UserAccess to @/components/admin/UserAccess
jest.mock("@/components/admin/UserAccess", () => ({
  UserAccessAdmin: ({ email }: { email: string }) => (
    <div data-email={email} data-testid="user-access-admin">
      User Access Admin Component
    </div>
  ),
}));

// Mock primitives
jest.mock("@/components/primitives", () => ({
  title: () => "dashboard-title",
}));

// Mock auth
jest.mock(
  "../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

describe("AdminPage", () => {
  const renderAdminPage = async (session: any = null) => {
    const { auth } = require("../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await AdminPage());
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows UnAuthenticated component when no session exists", async () => {
    await renderAdminPage(null);

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.queryByText("Admin Dashboard")).not.toBeInTheDocument();
  });

  it("renders admin dashboard when authenticated", async () => {
    const mockSession = {
      user: {
        email: "admin@example.com",
      },
    };

    await renderAdminPage(mockSession);

    // Check for admin dashboard components
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("user-access-admin")).toBeInTheDocument();
    expect(screen.getByTestId("user-access-admin")).toHaveAttribute(
      "data-email",
      "admin@example.com",
    );
  });

  it("has correct layout structure and styling", async () => {
    const mockSession = {
      user: {
        email: "admin@example.com",
      },
    };

    const { container } = await renderAdminPage(mockSession);

    // Check main container
    const mainContainer = container.firstChild as HTMLElement;

    expect(mainContainer).toHaveClass("mx-auto", "space-y-16");

    // Check title styling
    const title = screen.getByText("Admin Dashboard");

    expect(title).toHaveClass("dashboard-title");
  });

  describe("AdminPageContent", () => {
    it("shows UnAuthenticated when no session provided", async () => {
      const mockSession = null;

      await renderAdminPage(mockSession);

      expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
      expect(screen.queryByTestId("user-access-admin")).not.toBeInTheDocument();
    });

    it("passes correct email to UserAccessAdmin", async () => {
      const mockSession = {
        user: {
          email: "test.admin@example.com",
        },
      };

      await renderAdminPage(mockSession);

      const userAccessComponent = screen.getByTestId("user-access-admin");

      expect(userAccessComponent).toHaveAttribute(
        "data-email",
        "test.admin@example.com",
      );
    });
  });
});
