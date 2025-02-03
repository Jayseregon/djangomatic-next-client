import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import { UnAuthenticated } from "@/src/components/auth/unAuthenticated";
import { siteConfig } from "@/config/site";

// Mock heroui/snippet
jest.mock("@heroui/snippet", () => ({
  Snippet: ({
    children,
    hideCopyButton,
    hideSymbol,
    variant,
    ...props
  }: {
    children: React.ReactNode;
    hideCopyButton?: boolean;
    hideSymbol?: boolean;
    variant?: string;
  }) => (
    <div
      data-hide-copy={hideCopyButton}
      data-hide-symbol={hideSymbol}
      data-testid="auth-snippet"
      data-variant={variant}
      {...props}
    >
      {children}
    </div>
  ),
}));

describe("UnAuthenticated", () => {
  it("renders the component", () => {
    render(<UnAuthenticated />);
    expect(screen.getByTestId("unauthenticated")).toBeInTheDocument();
  });

  it("displays the site name", () => {
    render(<UnAuthenticated />);
    expect(screen.getByText(siteConfig.name)).toBeInTheDocument();
  });

  it("displays 'Not Authenticated' message", () => {
    render(<UnAuthenticated />);
    expect(screen.getByText("Not Authenticated")).toBeInTheDocument();
  });

  it("applies correct styling to container", () => {
    render(<UnAuthenticated />);
    const container = screen.getByTestId("unauthenticated");

    expect(container).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "gap-4",
      "py-8",
      "md:py-10",
    );
  });

  it("renders snippet with correct props", () => {
    render(<UnAuthenticated />);
    const snippet = screen.getByTestId("auth-snippet");

    expect(snippet).toBeInTheDocument();
    expect(snippet).toHaveAttribute("data-hide-copy", "true");
    expect(snippet).toHaveAttribute("data-hide-symbol", "true");
    expect(snippet).toHaveAttribute("data-variant", "flat");
  });
});
