import { render, screen } from "@testing-library/react";

import { auth } from "@/auth";
import RootPage from "@/app/page";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => key),
}));

// Mock next-intl/server
jest.mock("next-intl/server", () => ({
  setRequestLocale: jest.fn(),
}));

// Mock auth using the correct path
jest.mock(
  "../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

// Alternative path if needed:
// jest.mock("@/src/auth", () => ({
//   auth: jest.fn(),
// }));

// Mock HomeContent component
jest.mock("@/components/root/HomeContent", () => ({
  __esModule: true,
  default: ({ session }: { session: any }) => (
    <div data-session={!!session} data-testid="home-content">
      Mock Home Content
    </div>
  ),
}));

describe("RootPage", () => {
  const mockParams = Promise.resolve({ locale: "en" });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("passes auth session to HomeContent", async () => {
    const mockSession = { user: { name: "Test User" } };

    (auth as jest.Mock).mockResolvedValue(mockSession);

    const result = await RootPage({ params: mockParams });

    render(result);

    const homeContent = screen.getByTestId("home-content");

    expect(homeContent).toHaveAttribute("data-session", "true");
  });

  it("passes null session when not authenticated", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await RootPage({ params: mockParams });

    render(result);

    const homeContent = screen.getByTestId("home-content");

    expect(homeContent).toHaveAttribute("data-session", "false");
  });
});
