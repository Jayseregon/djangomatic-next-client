import { render, screen } from "@testing-library/react";

import { NonceContext } from "@/src/app/providers";
import Callout from "@/components/mdx/Callout";

describe("Callout", () => {
  const mockNonce = "test-nonce-123";
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NonceContext.Provider value={mockNonce}>{children}</NonceContext.Provider>
  );

  it("renders children content correctly", () => {
    render(
      <Callout>
        <p>Test content</p>
      </Callout>,
      { wrapper },
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies default styling when no type is specified", () => {
    const { container } = render(<Callout>Default callout</Callout>, {
      wrapper,
    });

    const calloutDiv = container.firstChild as HTMLElement;

    expect(calloutDiv).toHaveClass(
      "my-3",
      "px-4",
      "mx-auto",
      "rounded-md",
      "border-2",
      "border-l-8",
      "w-full",
    );
    expect(calloutDiv).not.toHaveClass("border-red-900", "border-yellow-900");
  });

  it("applies warning styling when type is warning", () => {
    const { container } = render(
      <Callout type="warning">Warning callout</Callout>,
      { wrapper },
    );

    const calloutDiv = container.firstChild as HTMLElement;

    expect(calloutDiv).toHaveClass(
      "border-yellow-900",
      "bg-yellow-50",
      "text-yellow-900",
    );
  });

  it("applies danger styling when type is danger", () => {
    const { container } = render(
      <Callout type="danger">Danger callout</Callout>,
      { wrapper },
    );

    const calloutDiv = container.firstChild as HTMLElement;

    expect(calloutDiv).toHaveClass(
      "border-red-900",
      "bg-red-50",
      "text-red-900",
    );
  });

  it("applies nonce from context", () => {
    const { container } = render(<Callout>Test content</Callout>, { wrapper });

    const calloutDiv = container.firstChild as HTMLElement;

    expect(calloutDiv).toHaveAttribute("nonce", mockNonce);
  });

  it("forwards additional props to the container", () => {
    const { container } = render(
      <Callout data-testid="custom-callout">Test content</Callout>,
      { wrapper },
    );

    const calloutDiv = container.firstChild as HTMLElement;

    expect(calloutDiv).toHaveAttribute("data-testid", "custom-callout");
  });
});
