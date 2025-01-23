import { render } from "@testing-library/react";

import LoadDynamicImage from "@/components/mdx/LoadDynamicImage";
import { NonceContext } from "@/src/app/providers";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img alt="" {...props} />,
}));

describe("LoadDynamicImage", () => {
  const mockNonce = "test-nonce-123";
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NonceContext.Provider value={mockNonce}>{children}</NonceContext.Provider>
  );

  it("renders with default dimensions", () => {
    const { container } = render(<LoadDynamicImage imageName="test-image" />, {
      wrapper,
    });

    const image = container.querySelector("img");

    expect(image).toHaveAttribute("src", "/assets/test-image.jpg");
    expect(image).toHaveAttribute("width", "200");
    expect(image).toHaveAttribute("height", "200");
  });

  it("renders with custom dimensions", () => {
    const { container } = render(
      <LoadDynamicImage height={400} imageName="test-image" width={300} />,
      { wrapper },
    );

    const image = container.querySelector("img");

    expect(image).toHaveAttribute("width", "300");
    expect(image).toHaveAttribute("height", "400");
  });

  it("applies correct styling", () => {
    const { container } = render(<LoadDynamicImage imageName="test-image" />, {
      wrapper,
    });

    const span = container.firstChild as HTMLElement;
    const image = container.querySelector("img");

    expect(span).toHaveClass("flex", "flex-col", "items-center");
    expect(image).toHaveClass(
      "shadow-xl",
      "shadow-slate-600/80",
      "dark:shadow-teal-900/80",
    );
  });

  it("applies nonce from context to both span and image", () => {
    const { container } = render(<LoadDynamicImage imageName="test-image" />, {
      wrapper,
    });

    const span = container.firstChild as HTMLElement;
    const image = container.querySelector("img");

    expect(span).toHaveAttribute("nonce", mockNonce);
    expect(image).toHaveAttribute("nonce", mockNonce);
  });

  it("applies correct image style properties", () => {
    const { container } = render(<LoadDynamicImage imageName="test-image" />, {
      wrapper,
    });

    const image = container.querySelector("img");

    expect(image).toHaveStyle({
      maxWidth: "100%",
      width: "auto",
      height: "auto",
    });
  });

  it("generates correct image source path", () => {
    const { container } = render(
      <LoadDynamicImage imageName="test-image-with-path" />,
      { wrapper },
    );

    const image = container.querySelector("img");

    expect(image).toHaveAttribute("src", "/assets/test-image-with-path.jpg");
    expect(image).toHaveAttribute("alt", "test-image-with-path");
  });
});
