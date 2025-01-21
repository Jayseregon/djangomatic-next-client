import { render, screen } from "@testing-library/react";

import RndPage from "@/app/rnd/page";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (str: string) =>
    str === "title" ? "R&D Dashboard" : "R&D Management",
}));

// Mock components
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <section data-testid="unauthenticated">
      <div>Not authenticated</div>
    </section>
  ),
}));

jest.mock("@/components/rnd/UserAccess", () => ({
  UserAccessRnDBoard: ({ email }: { email: string }) => (
    <div data-email={email} data-testid="user-access-rnd">
      RnD Board Component
    </div>
  ),
}));

// Mock primitives
jest.mock("@/components/primitives", () => ({
  title: ({ size }: { size?: string } = {}) =>
    size ? `title-${size}` : "title",
}));

// Mock auth
jest.mock(
  "../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

describe("RndPage", () => {
  const renderRndPage = async (session: any = null) => {
    const { auth } = require("../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await RndPage());
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows UnAuthenticated component when no session exists", async () => {
    await renderRndPage(null);

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.queryByTestId("user-access-rnd")).not.toBeInTheDocument();
  });

  it("renders RnD dashboard when authenticated", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
      },
    };

    await renderRndPage(mockSession);

    // Check for RnD dashboard components with actual rendered text
    expect(screen.getByText("R&D Dashboard")).toBeInTheDocument();
    expect(screen.getByText("R&D Management")).toBeInTheDocument();
    expect(screen.getByTestId("user-access-rnd")).toBeInTheDocument();
    expect(screen.getByTestId("user-access-rnd")).toHaveAttribute(
      "data-email",
      "test@example.com",
    );
  });

  it("has correct layout structure and styling", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
      },
    };

    const { container } = await renderRndPage(mockSession);

    // Check main container
    const mainContainer = container.firstChild as HTMLElement;

    expect(mainContainer).toHaveClass("mx-auto", "space-y-16");

    // Check flex container
    const flexContainer = mainContainer.firstChild as HTMLElement;

    expect(flexContainer).toHaveClass("flex", "flex-col");
  });

  describe("RndPageContent", () => {
    it("shows UnAuthenticated when no session provided", async () => {
      const nullSession = null;

      await renderRndPage(nullSession);

      expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
      expect(screen.queryByTestId("user-access-rnd")).not.toBeInTheDocument();
    });

    it("passes correct email to UserAccessRnDBoard", async () => {
      const mockSession = {
        user: {
          email: "test.rnd@example.com",
        },
      };

      await renderRndPage(mockSession);

      const rndComponent = screen.getByTestId("user-access-rnd");

      expect(rndComponent).toHaveAttribute(
        "data-email",
        "test.rnd@example.com",
      );
    });

    it("renders title with correct styles", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderRndPage(mockSession);

      // Check for title and subtitle with correct styling classes
      const title = screen.getByText("R&D Dashboard");
      const subtitle = screen.getByText("R&D Management");

      expect(title).toHaveClass("title");
      expect(subtitle).toHaveClass("title-xs");
    });
  });
});
