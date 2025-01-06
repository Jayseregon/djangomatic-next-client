import { render, screen } from "@testing-library/react";
import { useContext } from "react";

import { Providers, NonceContext } from "@/app/providers";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock NextUIProvider
jest.mock("@nextui-org/system", () => ({
  NextUIProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="nextui-provider">{children}</div>
  ),
}));

// Mock next-themes
jest.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
}));

// Test component to verify NonceContext
const TestNonceConsumer = () => {
  const nonce = useContext(NonceContext);

  return <div data-testid="nonce-value">{nonce}</div>;
};

describe("Providers", () => {
  const mockNonce = "test-nonce";
  const mockThemeProps = {
    attribute: "class" as const,
    defaultTheme: "dark",
  };

  it("renders all providers in correct order", () => {
    render(
      <Providers nonce={mockNonce} themeProps={mockThemeProps}>
        <div data-testid="test-child">Test Content</div>
      </Providers>,
    );

    const providers = screen.getAllByTestId(/-provider$/);

    expect(providers).toHaveLength(3);

    // Verify providers are rendered in the correct order
    expect(screen.getByTestId("session-provider")).toBeInTheDocument();
    expect(screen.getByTestId("nextui-provider")).toBeInTheDocument();
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();

    // Verify child content is rendered
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("provides nonce through context", () => {
    render(
      <Providers nonce={mockNonce}>
        <TestNonceConsumer />
      </Providers>,
    );

    expect(screen.getByTestId("nonce-value")).toHaveTextContent(mockNonce);
  });

  it("passes theme props correctly", () => {
    render(
      <Providers nonce={mockNonce} themeProps={mockThemeProps}>
        <div>Test Content</div>
      </Providers>,
    );

    const themeProvider = screen.getByTestId("theme-provider");

    expect(themeProvider).toBeInTheDocument();
  });

  it("renders without optional props", () => {
    render(
      <Providers>
        <div>Test Content</div>
      </Providers>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
