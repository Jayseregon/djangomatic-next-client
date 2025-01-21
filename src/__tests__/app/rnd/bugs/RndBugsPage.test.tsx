import { render, screen } from "@testing-library/react";

import BugsRnDSidePage from "@/app/rnd/bugs/page";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (str: string) =>
    str === "title" ? "R&D Bugs" : "Bugs Management",
}));

// Mock components
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <div data-testid="unauthenticated">Not authenticated</div>
  ),
}));

jest.mock("@/components/boards/bugs/BugsManager", () => ({
  BugsManager: ({
    isAdminSide,
    sessionUsername,
  }: {
    isAdminSide: boolean;
    sessionUsername: string;
  }) => (
    <div
      data-is-admin-side={isAdminSide}
      data-testid="bugs-manager"
      data-username={sessionUsername}
    >
      Bugs Manager Component
    </div>
  ),
}));

jest.mock("@/components/boards/UserAccess", () => ({
  __esModule: true,
  default: ({
    children,
    boardType,
    email,
  }: {
    children: React.ReactNode;
    boardType: string;
    email: string;
  }) => (
    <div
      data-board-type={boardType}
      data-email={email}
      data-testid="user-access-boards"
    >
      {children}
    </div>
  ),
}));

// Mock primitives
jest.mock("@/components/primitives", () => ({
  title: () => "bugs-title",
  subtitle: ({ class: className }: { class: string }) => className,
}));

// Mock auth with NextAuth
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

describe("BugsRnDSidePage", () => {
  const renderBugsPage = async (session: any = null) => {
    const { auth } = require("../../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await BugsRnDSidePage());
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows UnAuthenticated component when no session exists", async () => {
    await renderBugsPage(null);
    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
  });

  it("renders bugs dashboard when authenticated", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
        name: "Test User",
      },
    };

    await renderBugsPage(mockSession);

    expect(screen.getByText("R&D Bugs")).toBeInTheDocument();
    expect(screen.getByText("Bugs Management")).toBeInTheDocument();
    expect(screen.getByTestId("bugs-manager")).toBeInTheDocument();
    expect(screen.getByTestId("user-access-boards")).toHaveAttribute(
      "data-board-type",
      "canAccessRnd",
    );
  });

  describe("BoardsPageContent", () => {
    it("passes correct props to BugsManager", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
          name: "Test User",
        },
      };

      await renderBugsPage(mockSession);

      const bugsManager = screen.getByTestId("bugs-manager");

      expect(bugsManager).toHaveAttribute("data-is-admin-side", "true");
      expect(bugsManager).toHaveAttribute("data-username", "Test User");
    });

    it("wraps content in UserAccessBoards with correct props", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
          name: "Test User",
        },
      };

      await renderBugsPage(mockSession);

      const userAccess = screen.getByTestId("user-access-boards");

      expect(userAccess).toHaveAttribute("data-board-type", "canAccessRnd");
      expect(userAccess).toHaveAttribute("data-email", "test@example.com");
    });
  });
});
