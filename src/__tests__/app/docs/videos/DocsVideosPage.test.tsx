import { render, screen } from "@testing-library/react";

import DocsVideosPage from "@/app/docs/videos/[category]/page";

// Mock VideoPageContent component
jest.mock("@/components/docs/VideoPageContent", () => ({
  VideoPageContent: ({ session }: { session: any }) => (
    <div data-email={session?.user?.email} data-testid="video-page-content">
      Video Page Content
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

describe("DocsVideosPage", () => {
  const renderDocsVideosPage = async (session: any = null) => {
    const { auth } = require("../../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(await DocsVideosPage());
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders VideoPageContent with null session when not authenticated", async () => {
    await renderDocsVideosPage(null);

    const content = screen.getByTestId("video-page-content");

    expect(content).toBeInTheDocument();
    expect(content).not.toHaveAttribute("data-email");
  });

  it("renders VideoPageContent with session when authenticated", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
      },
    };

    await renderDocsVideosPage(mockSession);

    const content = screen.getByTestId("video-page-content");

    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute("data-email", "test@example.com");
  });

  it("passes session prop to VideoPageContent", async () => {
    const mockSession = {
      user: {
        email: "user@example.com",
        name: "Test User",
      },
    };

    await renderDocsVideosPage(mockSession);

    const content = screen.getByTestId("video-page-content");

    expect(content).toHaveAttribute("data-email", "user@example.com");
  });
});
