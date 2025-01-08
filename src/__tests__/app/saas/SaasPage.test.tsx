import { render, screen } from "@testing-library/react";

import SaasPage from "@/app/saas/page";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock primitives
jest.mock("@/components/primitives", () => ({
  title: () => "saas-title",
}));

// Mock AppsUsageGuidelines component
jest.mock("@/components/saas/AppsUsageGuidelines", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="apps-usage-guidelines">Apps Usage Guidelines</div>
  ),
}));

describe("SaasPage", () => {
  const renderSaasPage = () => {
    return render(<SaasPage />);
  };

  it("renders the saas page with title and subtitle", () => {
    renderSaasPage();

    const titleElement = screen.getByRole("heading", { level: 1 });

    expect(titleElement).toBeInTheDocument();
    expect(titleElement.textContent).toContain("title");
    expect(titleElement.textContent).toContain("subtitle");
  });

  it("renders the AppsUsageGuidelines component", () => {
    renderSaasPage();

    expect(screen.getByTestId("apps-usage-guidelines")).toBeInTheDocument();
  });

  it("has correct layout structure and styling", () => {
    const { container } = renderSaasPage();

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

  describe("SaasPage content", () => {
    it("renders title with correct styling", () => {
      renderSaasPage();
      const titleElement = screen.getByRole("heading", { level: 1 });

      expect(titleElement).toHaveClass("saas-title");
    });

    it("renders without crashing when translations are available", () => {
      expect(() => renderSaasPage()).not.toThrow();
    });
  });
});
