import { render, screen } from "@testing-library/react";

import UserPage from "@/app/rnd/[id]/page";

// Mock components
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <div data-testid="unauthenticated">Not authenticated</div>
  ),
}));

jest.mock("@/components/rnd/TaskManager", () => ({
  TaskManager: ({ id }: { id: string }) => (
    <div data-task-id={id} data-testid="task-manager">
      Task Manager Component
    </div>
  ),
}));

jest.mock("@/components/rnd/UserAccess", () => ({
  UserAccessRnDSection: ({
    email,
    children,
  }: {
    email: string;
    children: React.ReactNode;
  }) => (
    <div data-email={email} data-testid="user-access-rnd-section">
      {children}
    </div>
  ),
}));

// Mock auth
jest.mock(
  "../../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

describe("RndIdPage", () => {
  const renderRndIdPage = async (
    session: any = null,
    id: string = "test-id",
  ) => {
    const { auth } = require("../../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(
      await UserPage({
        params: Promise.resolve({ id }),
      }),
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows UnAuthenticated component when no session exists", async () => {
    await renderRndIdPage(null);

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.queryByTestId("task-manager")).not.toBeInTheDocument();
  });

  it("renders task manager with correct id when authenticated", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
      },
    };
    const testId = "test-task-id";

    await renderRndIdPage(mockSession, testId);

    const taskManager = screen.getByTestId("task-manager");

    expect(taskManager).toBeInTheDocument();
    expect(taskManager).toHaveAttribute("data-task-id", testId);
  });

  it("wraps content in UserAccessRnDSection with correct email", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
      },
    };

    await renderRndIdPage(mockSession);

    const userAccessSection = screen.getByTestId("user-access-rnd-section");

    expect(userAccessSection).toBeInTheDocument();
    expect(userAccessSection).toHaveAttribute(
      "data-email",
      mockSession.user.email,
    );
  });

  describe("UserPageContent", () => {
    it("shows UnAuthenticated when no session provided", async () => {
      const nullSession = null;

      await renderRndIdPage(nullSession);

      expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
      expect(screen.queryByTestId("task-manager")).not.toBeInTheDocument();
    });

    it("has correct layout structure", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };

      const { container } = await renderRndIdPage(mockSession);

      const mainContainer = container.querySelector(".mx-auto");

      expect(mainContainer).toHaveClass("space-y-16");
    });

    it("passes correct props to TaskManager", async () => {
      const mockSession = {
        user: {
          email: "test@example.com",
        },
      };
      const testId = "specific-task-id";

      await renderRndIdPage(mockSession, testId);

      const taskManager = screen.getByTestId("task-manager");

      expect(taskManager).toHaveAttribute("data-task-id", testId);
    });
  });
});
