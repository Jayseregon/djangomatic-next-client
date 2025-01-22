import { render, screen } from "@testing-library/react";

import { NonceContext } from "@/src/app/providers";
import Snippet from "@/src/components/mdx/snippet";

describe("Snippet", () => {
  const mockNonce = "test-nonce-123";
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NonceContext.Provider value={mockNonce}>{children}</NonceContext.Provider>
  );

  it("renders children content correctly", () => {
    render(<Snippet>const example = &quot;test&quot;;</Snippet>, { wrapper });

    expect(screen.getByText('const example = "test";')).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    const { container } = render(<Snippet>test code</Snippet>, { wrapper });

    const snippetSpan = container.firstChild as HTMLElement;

    expect(snippetSpan).toHaveClass(
      "inline-block",
      "bg-gray-300",
      "dark:bg-gray-600",
      "text-gray-600",
      "dark:text-gray-50",
      "p-1",
      "mx-1",
      "font-mono",
      "text-sm",
      "border-1",
      "border-gray-600",
      "dark:border-gray-50",
      "rounded-md",
    );
  });

  it("applies nonce from context", () => {
    const { container } = render(<Snippet>test content</Snippet>, { wrapper });

    const snippetSpan = container.firstChild as HTMLElement;

    expect(snippetSpan).toHaveAttribute("nonce", mockNonce);
  });

  it("renders complex children correctly", () => {
    render(
      <Snippet>
        <span>const</span> <em>variable</em> = <strong>value</strong>;
      </Snippet>,
      { wrapper },
    );

    expect(screen.getByText("const")).toBeInTheDocument();
    expect(screen.getByText("variable")).toBeInTheDocument();
    expect(screen.getByText("value")).toBeInTheDocument();
  });
});
