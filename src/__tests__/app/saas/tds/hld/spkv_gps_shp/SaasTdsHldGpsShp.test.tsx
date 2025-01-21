import { render, screen } from "@testing-library/react";

import SaasPage from "@/app/saas/tds/hld/spkv_gps_shp/page";

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

jest.mock("@/components/_dev/path-in-dev", () => ({
  __esModule: true,
  default: () => <div data-testid="path-in-dev">Path in Development</div>,
}));

// Mock auth
jest.mock(
  "../../../../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

describe("SaasTdsHldGpsShp Page", () => {
  const renderPage = async (session: any = null) => {
    const { auth } = require("../../../../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await SaasPage());
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Authentication and Content", () => {
    it("shows UnAuthenticated component when no session exists", async () => {
      await renderPage(null);

      expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
      expect(
        screen.queryByTestId("permission-overlay"),
      ).not.toBeInTheDocument();
    });

    it("renders authenticated content with correct permissions", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderPage(mockSession);

      const overlay = screen.getByTestId("permission-overlay");

      expect(overlay).toHaveAttribute("data-email", "test@example.com");
      expect(overlay).toHaveAttribute("data-permission", "canAccessAppsTdsHLD");
      expect(screen.getByTestId("path-in-dev")).toBeInTheDocument();
      expect(overlay).toContainElement(screen.getByTestId("path-in-dev"));
    });
  });
});
