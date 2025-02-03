import { render, screen } from "@testing-library/react";

import HomeContent from "@/components/root/HomeContent";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => key),
}));

// Mock LottieAnimation
jest.mock("@/components/ui/LottieAnimation", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-lottie">Lottie Animation</div>,
}));

// Mock BugReportNotice
jest.mock("@/components/root/BugReportNotice", () => ({
  BugReportNotice: () => (
    <div data-testid="mock-bug-report">
      <p>BugReport</p>
      <a href="/boards/bug-report">Link</a>
    </div>
  ),
}));

describe("HomeContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders UnAuthenticated when no session provided", () => {
    render(<HomeContent session={null} />);
    expect(screen.getByText("Not Authenticated")).toBeInTheDocument();
  });

  it("renders main content when session is provided", () => {
    const mockSession = { user: { name: "Test User" } };

    render(<HomeContent session={mockSession} />);

    // Verify main content elements
    expect(screen.getByText("HeroTitle")).toBeInTheDocument();
    expect(screen.getByText("Description1")).toBeInTheDocument();
    expect(screen.getByText("Description2")).toBeInTheDocument();
    expect(screen.getByTestId("mock-lottie")).toBeInTheDocument();
    expect(screen.getByTestId("mock-bug-report")).toBeInTheDocument();
  });

  it("renders bug report section with correct link", () => {
    const mockSession = { user: { name: "Test User" } };

    render(<HomeContent session={mockSession} />);

    // Check for bug report section
    const bugReportSection = screen.getByTestId("mock-bug-report");

    expect(bugReportSection).toBeInTheDocument();
    expect(bugReportSection).toHaveTextContent("BugReport");

    // Check for link
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", "/boards/bug-report");
  });

  it("renders app name", () => {
    const mockSession = { user: { name: "Test User" } };

    render(<HomeContent session={mockSession} />);

    // AppName renders as an h1 with specific text
    expect(screen.getByText("Djangomatic Pro")).toBeInTheDocument();
  });
});
