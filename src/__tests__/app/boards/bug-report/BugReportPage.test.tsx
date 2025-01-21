import { render, screen } from "@testing-library/react";

import BoardsPage from "@/app/boards/bug-report/page";

// Mock next-intl with specific translations
jest.mock("next-intl", () => ({
  useTranslations: () => (_key: string) => {
    // Simply return "title" for any translation key as that's what's being rendered
    return "title";
  },
}));

// Mock components
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <div data-testid="unauthenticated">Not authenticated</div>
  ),
}));

jest.mock("@/components/boards/bugs/BugsManager", () => ({
  BugsManager: ({ sessionUsername }: { sessionUsername: string }) => (
    <div data-testid="bugs-manager" data-username={sessionUsername}>
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
  title: () => "bug-report-title",
}));

// Mock auth
jest.mock(
  "../../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

describe("BugReportPage", () => {
  const renderBugReportPage = async (session: any = null) => {
    const { auth } = require("../../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await BoardsPage());
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows UnAuthenticated component when no session exists", async () => {
    await renderBugReportPage(null);

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.queryByTestId("bugs-manager")).not.toBeInTheDocument();
  });

  it("renders bug report board when authenticated", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
        name: "Test User",
      },
    };

    await renderBugReportPage(mockSession);

    // Check for main components using the actual rendered text
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByTestId("bugs-manager")).toBeInTheDocument();
    expect(screen.getByTestId("user-access-boards")).toBeInTheDocument();

    // Verify props passing
    expect(screen.getByTestId("bugs-manager")).toHaveAttribute(
      "data-username",
      "Test User",
    );
    expect(screen.getByTestId("user-access-boards")).toHaveAttribute(
      "data-board-type",
      "canAccessBugReportBoard",
    );
    expect(screen.getByTestId("user-access-boards")).toHaveAttribute(
      "data-email",
      "test@example.com",
    );
  });

  describe("BoardsPageContent", () => {
    it("shows UnAuthenticated when no session provided", async () => {
      const nullSession = null;

      await renderBugReportPage(nullSession);

      expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
      expect(screen.queryByTestId("bugs-manager")).not.toBeInTheDocument();
    });

    it("wraps content in UserAccessBoards with correct props", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
          name: "Test User",
        },
      };

      await renderBugReportPage(mockSession);

      const userAccessWrapper = screen.getByTestId("user-access-boards");

      expect(userAccessWrapper).toContainElement(
        screen.getByTestId("bugs-manager"),
      );
      expect(userAccessWrapper).toContainElement(screen.getByText("title"));
    });
  });
});
