import { render, screen } from "@testing-library/react";

import RoadmapBoardPage from "@/app/boards/roadmap/page";

// Mock components
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <div data-testid="unauthenticated">Not authenticated</div>
  ),
}));

jest.mock("@/components/boards/roadmap/AllCardsView", () => ({
  __esModule: true,
  default: ({ session }: { session: any }) => (
    <div data-email={session?.user?.email} data-testid="all-cards-view">
      Roadmap Board View
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

describe("RoadmapBoardPage", () => {
  const renderRoadmapPage = async (session: any = null) => {
    const { auth } = require("../../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await RoadmapBoardPage());
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows UnAuthenticated component when no session exists", async () => {
    await renderRoadmapPage(null);

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.queryByTestId("all-cards-view")).not.toBeInTheDocument();
  });

  it("renders AllCardsView when authenticated", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
      },
    };

    await renderRoadmapPage(mockSession);

    const allCardsView = screen.getByTestId("all-cards-view");

    expect(allCardsView).toBeInTheDocument();
    expect(allCardsView).toHaveAttribute("data-email", "test@example.com");
  });
});
