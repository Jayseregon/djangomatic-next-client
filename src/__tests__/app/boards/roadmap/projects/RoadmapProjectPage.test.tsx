import { render, screen } from "@testing-library/react";

import RoadmapBoardPage from "@/app/boards/roadmap/projects/[id]/page";

// Mock components
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <div data-testid="unauthenticated">Not authenticated</div>
  ),
}));

jest.mock("@/components/boards/roadmap/ProjectView", () => ({
  __esModule: true,
  default: ({ projectId, session }: { projectId: string; session: any }) => (
    <div
      data-project-id={projectId}
      data-session-email={session?.user?.email}
      data-testid="project-view"
    >
      Project View Component
    </div>
  ),
}));

// Mock auth
jest.mock(
  "../../../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

describe("RoadmapProjectPage", () => {
  const renderProjectPage = async (
    session: any = null,
    params = { id: "test-project-id" },
  ) => {
    const { auth } = require("../../../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await RoadmapBoardPage({ params }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows UnAuthenticated component when no session exists", async () => {
    await renderProjectPage(null);

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.queryByTestId("project-view")).not.toBeInTheDocument();
  });

  it("renders ProjectView when authenticated", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
      },
    };

    await renderProjectPage(mockSession);

    const projectView = screen.getByTestId("project-view");

    expect(projectView).toBeInTheDocument();
    expect(projectView).toHaveAttribute("data-project-id", "test-project-id");
    expect(projectView).toHaveAttribute(
      "data-session-email",
      "test@example.com",
    );
  });

  it("passes correct projectId from params", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
      },
    };
    const mockParams = { id: "custom-project-123" };

    await renderProjectPage(mockSession, mockParams);

    expect(screen.getByTestId("project-view")).toHaveAttribute(
      "data-project-id",
      "custom-project-123",
    );
  });
});
