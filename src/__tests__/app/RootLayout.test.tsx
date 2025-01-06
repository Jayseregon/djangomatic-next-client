import { render, screen } from "@testing-library/react";

import RootLayout from "@/app/layout";

import { auth } from "../__mocks__/auth";

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: jest.fn(() => (key: string) => key),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="next-intl-provider">{children}</div>
  ),
}));

// Mock next-intl/server
jest.mock("next-intl/server", () => ({
  getLocale: jest.fn(() => "en"),
  getMessages: jest.fn(() => ({
    test: "Test Message",
  })),
  setRequestLocale: jest.fn(),
}));

// Mock next/headers
jest.mock("next/headers", () => ({
  headers: jest.fn(() => new Map([["x-nonce", "test-nonce"]])),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock providers
jest.mock("@/app/providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

// Mock components
jest.mock("@/components/ui/navbar", () => ({
  Navbar: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="mock-navbar">{children}</div>
  ),
}));

jest.mock("@/components/ui/footer", () => ({
  Footer: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="mock-footer">{children}</div>
  ),
}));

// Mock auth
jest.mock(
  "../../../auth",
  () => ({
    auth: jest.fn(),
  }),
  { virtual: true },
);

// Custom render function with better error suppression
const renderWithProviders = async (ui: React.ReactNode) => {
  const mockSession = { user: { name: "Test User" } };

  (auth as jest.Mock).mockResolvedValue(mockSession);
  const Component = await ui;

  // More comprehensive error suppression
  const originalError = console.error;

  console.error = jest.fn((...args: any[]) => {
    const msg = typeof args[0] === "string" ? args[0] : "";

    if (msg.includes("<html>") || msg.includes("hydration")) {
      return;
    }
    originalError.call(console, ...args);
  });

  // Create container element
  const container = document.createElement("div");

  document.body.appendChild(container);

  const result = render(Component, {
    container,
  });

  // Cleanup
  console.error = originalError;

  return result;
};

describe("RootLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with basic structure", async () => {
    await renderWithProviders(
      RootLayout({
        children: <div>Test Content</div>,
      }),
    );

    expect(screen.getByTestId("mock-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies correct lang attribute and nonce", async () => {
    await renderWithProviders(
      RootLayout({
        children: <div>Test Content</div>,
      }),
    );

    const html = document.documentElement;

    expect(html).toHaveAttribute("lang", "en");
    expect(html).toHaveAttribute("nonce", "test-nonce");
  });

  it("includes providers", async () => {
    await renderWithProviders(
      RootLayout({
        children: <div>Test Content</div>,
      }),
    );

    expect(document.body).toHaveClass(
      "min-h-max",
      "bg-background",
      "font-sans",
      "antialiased",
    );
    expect(screen.getByTestId("providers")).toBeInTheDocument();
    expect(screen.getByTestId("next-intl-provider")).toBeInTheDocument();
  });
});
