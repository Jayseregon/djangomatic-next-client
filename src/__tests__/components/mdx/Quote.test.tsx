import { render, screen } from "@testing-library/react";

import { NonceContext } from "@/src/app/providers";
import Quote from "@/components/mdx/Quote";

describe("Quote", () => {
  const mockNonce = "test-nonce-123";
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NonceContext.Provider value={mockNonce}>{children}</NonceContext.Provider>
  );

  it("renders children content correctly", () => {
    render(<Quote>Test quote content</Quote>, { wrapper });

    expect(screen.getByText("Test quote content")).toBeInTheDocument();
  });

  it("applies correct default styling", () => {
    const { container } = render(<Quote>Styled quote</Quote>, { wrapper });

    const quoteSpan = container.firstChild as HTMLElement;

    expect(quoteSpan).toHaveClass(
      "inline-block",
      "text-gray-600",
      "dark:text-gray-50",
      "italic",
      "font-mono",
      "text-sm",
    );
  });

  it("applies nonce from context", () => {
    const { container } = render(<Quote>Test content</Quote>, { wrapper });

    const quoteSpan = container.firstChild as HTMLElement;

    expect(quoteSpan).toHaveAttribute("nonce", mockNonce);
  });

  it("renders complex children correctly", () => {
    render(
      <Quote>
        <span>Nested</span>
        <strong>formatted</strong>
        <em>content</em>
      </Quote>,
      { wrapper },
    );

    expect(screen.getByText("Nested")).toBeInTheDocument();
    expect(screen.getByText("formatted")).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
