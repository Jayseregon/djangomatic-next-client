import { render, screen } from "@testing-library/react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import { auth } from "@/auth";
import RootPage, { HomeContent } from "@/app/page";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => key),
}));

// Mock next-intl/server
jest.mock("next-intl/server", () => ({
  setRequestLocale: jest.fn(),
}));

// Use path relative to the mock file
jest.mock(
  "../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the LottieAnimation component
jest.mock("@/components/ui/LottieAnimation", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-lottie">Lottie Animation</div>,
}));

describe("RootPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders HomeContent with session when authenticated", async () => {
    const mockSession = { user: { name: "Test User" } };

    (auth as jest.Mock).mockResolvedValue(mockSession);
    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: "authenticated",
    });

    const result = await RootPage({
      params: Promise.resolve({ locale: "en" }),
    });

    render(result);

    // Should not show UnAuthenticated component
    expect(screen.queryByText("Not Authenticated")).not.toBeInTheDocument();

    // Should show main content elements
    expect(screen.getByText("HeroTitle")).toBeInTheDocument();
    expect(screen.getByText("Description1")).toBeInTheDocument();
    expect(screen.getByText("Description2")).toBeInTheDocument();
  });

  it("renders UnAuthenticated when no session", async () => {
    (auth as jest.Mock).mockResolvedValue(null);
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    const result = await RootPage({
      params: Promise.resolve({ locale: "en" }),
    });

    render(result);

    expect(screen.getByText("Not Authenticated")).toBeInTheDocument();
  });
});

describe("HomeContent", () => {
  beforeEach(() => {
    (useTranslations as jest.Mock).mockImplementation(
      () => (key: string) => key,
    );
  });

  it("renders UnAuthenticated when no session provided", () => {
    render(<HomeContent session={null} />);
    expect(screen.getByText("Not Authenticated")).toBeInTheDocument();
  });

  it("renders main content when session is provided", () => {
    const mockSession = { user: { name: "Test User" } };

    render(<HomeContent session={mockSession} />);

    // Check for main content elements
    expect(screen.getByText("HeroTitle")).toBeInTheDocument();
    expect(screen.getByText("Description1")).toBeInTheDocument();
    expect(screen.getByText("Description2")).toBeInTheDocument();
    expect(screen.getByText("BugReport")).toBeInTheDocument();

    // Check for Lottie animation
    expect(screen.getByTestId("mock-lottie")).toBeInTheDocument();

    // Check for the bug report link
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/boards/bug-report",
    );
  });

  it("renders the bug report section with correct elements", () => {
    const mockSession = { user: { name: "Test User" } };

    render(<HomeContent session={mockSession} />);

    // Check for bug report elements
    expect(screen.getByText("BugReport")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/boards/bug-report",
    );
  });
});
