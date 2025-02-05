import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";

import ButtonPDFRenderer from "@/src/components/reports/ButtonPDFRenderer";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("ButtonPDFRenderer", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Setup router mock for each test
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
      asPath: "/reports/123",
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders PDF button correctly", () => {
    render(<ButtonPDFRenderer />);

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("mt-4");
    expect(button).toHaveAttribute("type", "button");
  });

  it("redirects to PDF route when clicked", () => {
    render(<ButtonPDFRenderer />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/reports/123/pdf");
  });

  it("contains PDF icon", () => {
    render(<ButtonPDFRenderer />);

    // Check if PDFFileIcon is rendered (look for SVG)
    const pdfIcon = screen.getByRole("button").querySelector("svg");

    expect(pdfIcon).toBeInTheDocument();
  });
});
