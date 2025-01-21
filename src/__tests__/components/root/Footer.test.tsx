import { render, screen } from "@testing-library/react";

import { Footer } from "@/src/components/root/Footer";

describe("Footer component", () => {
  const mockDate = new Date(2024, 0, 1); // January 1, 2024
  const realDate = Date;

  beforeAll(() => {
    global.Date = class extends Date {
      constructor() {
        super();

        return mockDate;
      }
    } as DateConstructor;
  });

  afterAll(() => {
    global.Date = realDate;
  });

  it("renders correctly with all required elements", () => {
    render(<Footer />);

    // Check for text content
    expect(screen.getByText("Made with")).toBeInTheDocument();
    expect(screen.getByText("in Canada")).toBeInTheDocument();
    expect(screen.getByText("© 2024 Telecon Design")).toBeInTheDocument();
  });

  it("renders with provided nonce", () => {
    const testNonce = "test-nonce-123";
    const { container } = render(<Footer nonce={testNonce} />);

    const footer = container.querySelector("footer");

    expect(footer).toHaveAttribute("nonce", testNonce);
  });

  it("renders heart icon", () => {
    render(<Footer />);

    // Check for heart icon SVG
    const heartIcon = document.querySelector('svg[role="presentation"]');

    expect(heartIcon).toBeInTheDocument();
    expect(heartIcon).toHaveAttribute("height", "20");
    expect(heartIcon).toHaveAttribute("width", "20");
  });
});
