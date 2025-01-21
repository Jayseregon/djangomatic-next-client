import { render, screen } from "@testing-library/react";

import DocsPage from "@/app/docs/page";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock primitives
jest.mock("@/components/primitives", () => ({
  title: () => "docs-title",
}));

// Mock DocsUsageGuidelines component - Fixed import path
jest.mock("@/components/docs/DocsUsageGuidelines", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="docs-usage-guidelines">Usage Guidelines</div>
  ),
}));

describe("DocsPage", () => {
  const renderDocsPage = () => {
    return render(<DocsPage />);
  };

  it("renders the docs page with title and subtitle", () => {
    renderDocsPage();

    // Use a more flexible text matching approach
    const titleElement = screen.getByRole("heading", { level: 1 });

    expect(titleElement).toBeInTheDocument();
    expect(titleElement.textContent).toContain("title");
    expect(titleElement.textContent).toContain("subtitle");
  });

  it("renders the DocsUsageGuidelines component", () => {
    renderDocsPage();

    expect(screen.getByTestId("docs-usage-guidelines")).toBeInTheDocument();
  });

  it("has correct layout structure and styling", () => {
    const { container } = renderDocsPage();

    // Check main container
    const mainContainer = container.firstChild as HTMLElement;

    expect(mainContainer).toHaveClass(
      "text-center",
      "max-w-screen-md",
      "mx-auto",
      "space-y-16",
    );

    // Check title container
    const titleContainer = container.querySelector(".max-w-sm");

    expect(titleContainer).toHaveClass("max-w-sm", "mx-auto");
  });

  describe("DocsPage content", () => {
    it("renders title with correct styling", () => {
      renderDocsPage();
      const titleElement = screen.getByRole("heading", { level: 1 });

      expect(titleElement).toHaveClass("docs-title");
    });

    it("renders without crashing when translations are available", () => {
      expect(() => renderDocsPage()).not.toThrow();
    });
  });
});
