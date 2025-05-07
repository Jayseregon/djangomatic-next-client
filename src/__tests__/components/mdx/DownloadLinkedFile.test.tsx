import React from "react";
import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import DownloadLinkedFile from "@/src/components/mdx/DownloadLinkedFile";
import { NonceContext } from "@/src/app/providers";

// Mock the NonceContext
const mockNonce = "test-nonce-value";
const NonceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <NonceContext.Provider value={mockNonce}>{children}</NonceContext.Provider>
);

describe("DownloadLinkedFile Component", () => {
  test("renders with required filename prop", () => {
    render(
      <NonceProvider>
        <DownloadLinkedFile filename="document.pdf" />
      </NonceProvider>,
    );

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/download/document.pdf");
    expect(button).toHaveAttribute("download");
  });

  test("has correct button attributes", () => {
    render(
      <NonceProvider>
        <DownloadLinkedFile filename="document.xlsx" />
      </NonceProvider>,
    );

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("variant", "solid");
    expect(button).toHaveAttribute("radius", "full");
    expect(button).toHaveClass("bg-primary");
    expect(button).toHaveClass("text-white");
  });

  test("constructs download URL correctly", () => {
    const filename = "complex-file-name.pdf";

    render(
      <NonceProvider>
        <DownloadLinkedFile filename={filename} />
      </NonceProvider>,
    );

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("href", `/download/${filename}`);
  });

  test("has fixed position styling", () => {
    render(
      <NonceProvider>
        <DownloadLinkedFile filename="document.pdf" />
      </NonceProvider>,
    );

    const wrapper = screen.getByRole("button").parentElement;

    expect(wrapper).toHaveStyle({
      position: "fixed",
      top: "5rem",
      right: "1.5rem",
      zIndex: 50,
    });
  });

  test("includes Download icon", () => {
    render(
      <NonceProvider>
        <DownloadLinkedFile filename="document.pdf" />
      </NonceProvider>,
    );

    // Check that an SVG element is present in the button
    // This is an indirect way to verify the Download icon is rendered
    const button = screen.getByRole("button");

    expect(button.querySelector("svg")).toBeInTheDocument();
  });
});
