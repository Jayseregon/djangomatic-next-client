import { render, screen } from "@testing-library/react";

import RnDLayout from "@/app/rnd/layout";

// Mock next/headers
jest.mock("next/headers", () => ({
  headers: jest.fn(() => new Map([["x-nonce", "test-nonce"]])),
}));

// Mock components
jest.mock("@/components/auth/unAuthenticated", () => ({
  UnAuthenticated: () => (
    <div data-testid="unauthenticated">Not authenticated</div>
  ),
}));

jest.mock("@/components/ui/SearchInput", () => ({
  SearchInput: ({ alwaysExpanded }: { alwaysExpanded: boolean }) => (
    <div data-expanded={alwaysExpanded} data-testid="search-input">
      Search Input
    </div>
  ),
}));

jest.mock("@/components/ui/sidebars/SidebarRnD", () => ({
  SidebarRnD: ({ email, nonce }: { email: string; nonce: string }) => (
    <div data-email={email} data-nonce={nonce} data-testid="sidebar-rnd">
      Sidebar
    </div>
  ),
}));

// Mock auth
jest.mock(
  "../../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

describe("RnDLayout", () => {
  const renderLayout = async (session: any = null) => {
    // Update the mock implementation before each render
    const { auth } = require("../../../../auth");

    (auth as jest.Mock).mockImplementation(() => Promise.resolve(session));

    return render(
      await RnDLayout({
        children: <div data-testid="content">Test Content</div>,
      }),
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows UnAuthenticated component when no session exists", async () => {
    await renderLayout(null);

    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });

  it("renders the layout with all components when authenticated", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
      },
    };

    await renderLayout(mockSession);

    // Add waitFor to handle async rendering
    await screen.findByTestId("search-input");
    await screen.findByTestId("sidebar-rnd");
    await screen.findByTestId("content");

    // Verify props are passed correctly
    expect(screen.getByTestId("search-input")).toHaveAttribute(
      "data-expanded",
      "true",
    );
    expect(screen.getByTestId("sidebar-rnd")).toHaveAttribute(
      "data-email",
      "test@example.com",
    );
    expect(screen.getByTestId("sidebar-rnd")).toHaveAttribute(
      "data-nonce",
      "test-nonce",
    );
  });

  it("has correct layout structure and classes", async () => {
    const mockSession = {
      user: {
        email: "test@example.com",
      },
    };

    const { container } = await renderLayout(mockSession);

    // Wait for content to be rendered
    const content = await screen.findByTestId("content");

    // Check the main container - select the first div in the container
    const mainContainer = container.firstChild as HTMLElement;

    expect(mainContainer).toHaveClass("flex", "min-h-screen");

    // Check the search input container
    const searchContainer = screen.getByTestId("search-input").parentElement;

    expect(searchContainer).toHaveClass("w-72", "fixed", "inset-y-0", "left-0");

    // Check the sidebar container
    const sidebarContainer = screen.getByTestId("sidebar-rnd").parentElement;

    expect(sidebarContainer).toHaveClass(
      "w-72",
      "fixed",
      "inset-y-0",
      "left-0",
      "overflow-y-auto",
    );

    // Check the content section
    const contentSection = content.closest("section");

    expect(contentSection).toHaveClass(
      "flex-grow",
      "ml-72",
      "flex",
      "flex-col",
      "items-center",
    );
  });
});
