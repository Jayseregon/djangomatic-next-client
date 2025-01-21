import { render, screen } from "@testing-library/react";

import DocsLayout from "@/app/docs/layout";

// next-intl mock is already handled by jest.config.ts

jest.mock("@/components/ui/sidebars/SidebarDocs", () => ({
  SidebarDocs: () => <div data-testid="sidebar-docs">Sidebar Docs</div>,
}));

jest.mock("@/components/ui/SearchInput", () => ({
  SearchInput: () => <div data-testid="search-input">Search Input</div>,
}));

describe("DocsLayout", () => {
  const mockProps = {
    children: <div>Test Content</div>,
    params: Promise.resolve({ locale: "en" }),
  };

  it("renders children correctly", async () => {
    render(await DocsLayout(mockProps));
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders sidebar and search components", async () => {
    render(await DocsLayout(mockProps));
    expect(screen.getByTestId("sidebar-docs")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });

  it("has correct styling classes", async () => {
    const { container } = render(await DocsLayout(mockProps));

    // Check main container
    const mainDiv = container.firstChild as HTMLElement;

    expect(mainDiv).toHaveClass("flex", "min-h-screen");

    // Check search container
    const searchContainer = container.querySelector(".w-72.fixed.mt-20");

    expect(searchContainer).toBeInTheDocument();

    // Check sidebar container
    const sidebarContainer = container.querySelector(".w-72.fixed.mt-32");

    expect(sidebarContainer).toHaveClass("overflow-y-auto");

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
    const contentDiv = section?.firstChild as HTMLElement;

    expect(contentDiv).toHaveClass(
      "inline-block",
      "max-w-full",
      "text-center",
      "justify-center",
    );
  });
});
