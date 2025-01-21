import { render, screen } from "@testing-library/react";

import { BugReportNotice } from "@/components/root/BugReportNotice";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => key),
}));

// Mock @heroui/snippet
jest.mock("@heroui/snippet", () => ({
  Snippet: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="snippet-wrapper">{children}</div>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Bug: ({ color }: { color?: string }) => (
    <span data-color={color} data-testid="bug-icon" />
  ),
  SquareArrowOutUpRight: ({ color }: { color?: string }) => (
    <span data-color={color} data-testid="arrow-icon" />
  ),
}));

describe("BugReportNotice", () => {
  it("renders all elements correctly", () => {
    render(<BugReportNotice />);

    // Check if Snippet wrapper is present
    expect(screen.getByTestId("snippet-wrapper")).toBeInTheDocument();

    // Check if icons are rendered
    expect(screen.getByTestId("bug-icon")).toBeInTheDocument();
    expect(screen.getByTestId("arrow-icon")).toBeInTheDocument();

    // Check if text is present
    expect(screen.getByText("BugReport")).toBeInTheDocument();

    // Check if link is present with correct href
    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", "/boards/bug-report");
  });

  it("has correct styling classes", () => {
    render(<BugReportNotice />);

    // Check for flex container
    const container = screen.getByTestId("snippet-wrapper").children[0];

    expect(container).toHaveClass("inline-flex", "space-x-2", "items-center");

    // Check paragraph styling
    const paragraph = screen.getByText("BugReport");

    expect(paragraph).toHaveClass(
      "text-center",
      "pt-1",
      "text-red-800",
      "dark:text-red-300",
      "flex",
      "items-center",
    );

    // Check link styling
    const link = screen.getByRole("link");

    expect(link).toHaveClass("flex", "items-center");
  });

  it("uses red color for icons", () => {
    render(<BugReportNotice />);

    const bugIcon = screen.getByTestId("bug-icon");
    const arrowIcon = screen.getByTestId("arrow-icon");

    // Check if icons have the correct color prop using data-color
    expect(bugIcon).toHaveAttribute("data-color", "#dc2626");
    expect(arrowIcon).toHaveAttribute("data-color", "#dc2626");
  });
});
