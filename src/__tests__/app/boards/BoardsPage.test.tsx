import { render, screen } from "@testing-library/react";

import BoardsPage from "@/app/boards/page";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock components
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <section data-testid="unauthenticated">
      <div>Not authenticated</div>
    </section>
  ),
}));

jest.mock("@/components/boards/BoardCard", () => ({
  BoardCard: ({ href, target }: { href: string; target?: string }) => (
    <div data-href={href} data-target={target} data-testid="board-card">
      Board Card
    </div>
  ),
}));

// Mock primitives
jest.mock("@/components/primitives", () => ({
  title: () => "board-title",
  subtitle: ({ className }: { className: string }) =>
    `board-subtitle ${className}`,
}));

// Mock site config
jest.mock("@/config/site", () => ({
  siteConfig: {
    boardsNavItems: [
      { label: "Board1", href: "/board1" },
      { label: "Board2", href: "/board2", target: "_blank" },
    ],
  },
}));

// Mock auth
jest.mock(
  "../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

describe("BoardsPage", () => {
  const renderBoardsPage = async (session: any = null) => {
    const { auth } = require("../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await BoardsPage());
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows UnAuthenticated component when no session exists", async () => {
    await renderBoardsPage(null);

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.queryByTestId("board-card")).not.toBeInTheDocument();
  });

  it("renders boards page content when authenticated", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
      },
    };

    await renderBoardsPage(mockSession);

    // Check for title and subtitle
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("subtitle")).toBeInTheDocument();

    // Check for board cards
    const boardCards = screen.getAllByTestId("board-card");

    expect(boardCards).toHaveLength(2);

    // Verify board card props
    expect(boardCards[0]).toHaveAttribute("data-href", "/board1");
    expect(boardCards[1]).toHaveAttribute("data-href", "/board2");
    expect(boardCards[1]).toHaveAttribute("data-target", "_blank");
  });

  it("has correct layout structure and styling", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
      },
    };

    const { container } = await renderBoardsPage(mockSession);

    // Check main container
    const mainContainer = container.firstChild as HTMLElement;

    expect(mainContainer).toHaveClass("mx-auto", "space-y-16", "max-w-7xl");

    // Check grid container
    const gridContainer = container.querySelector(".grid");

    expect(gridContainer).toHaveClass(
      "grid",
      "grid-cols-1",
      "md:grid-cols-3",
      "gap-10",
    );
  });

  describe("BoardsPageContent", () => {
    it("shows UnAuthenticated when no session provided", async () => {
      // Set session to null for both main component and content component
      const nullSession = null;

      await renderBoardsPage(nullSession);

      expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
      expect(screen.queryByTestId("board-card")).not.toBeInTheDocument();
    });

    it("renders correct number of board cards", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      await renderBoardsPage(mockSession);

      const boardCards = screen.getAllByTestId("board-card");

      expect(boardCards).toHaveLength(2); // Based on mock siteConfig
    });
  });
});
