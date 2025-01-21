import { render, screen } from "@testing-library/react";

import SaasLayout from "@/app/saas/layout";

jest.mock("@/components/ui/sidebars/SidebarSaas", () => ({
  SidebarSaas: () => <div data-testid="sidebar-saas">Sidebar Saas</div>,
}));

jest.mock("@/components/ui/SearchInput", () => ({
  SearchInput: ({ alwaysExpanded }: { alwaysExpanded: boolean }) => (
    <div data-expanded={alwaysExpanded} data-testid="search-input">
      Search Input
    </div>
  ),
}));

describe("SaasLayout", () => {
  const mockProps = {
    children: <div data-testid="test-content">Test Content</div>,
  };

  it("renders children correctly", async () => {
    render(await SaasLayout(mockProps));
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
  });

  it("renders sidebar and search components", async () => {
    render(await SaasLayout(mockProps));
    expect(screen.getByTestId("sidebar-saas")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toHaveAttribute(
      "data-expanded",
      "true",
    );
  });

  it("has correct styling classes", async () => {
    const { container } = render(await SaasLayout(mockProps));

    // Check main container
    const mainDiv = container.firstChild as HTMLElement;

    expect(mainDiv).toHaveClass("flex", "min-h-screen");

    // Check search container
    const searchContainer = screen.getByTestId("search-input").parentElement;

    expect(searchContainer).toHaveClass(
      "w-72",
      "fixed",
      "inset-y-0",
      "left-0",
      "mt-20",
      "ms-4",
      "mb-12",
    );

    // Check sidebar container
    const sidebarContainer = screen.getByTestId("sidebar-saas").parentElement;

    expect(sidebarContainer).toHaveClass(
      "w-72",
      "fixed",
      "inset-y-0",
      "left-0",
      "mt-32",
      "ms-4",
      "mb-12",
      "overflow-y-auto",
    );

    // Check main content section
    const section = container.querySelector("section");

    expect(section).toHaveClass(
      "flex-grow",
      "ml-72",
      "flex",
      "flex-col",
      "items-center",
      "gap-4",
      "py-8",
      "md:py-10",
      "overflow-y-auto",
    );

    // Check content container
    const contentDiv = screen.getByTestId("test-content").parentElement;

    expect(contentDiv).toHaveClass(
      "inline-block",
      "max-w-full",
      "text-center",
      "justify-center",
    );
  });
});
