import { render, screen } from "@testing-library/react";

import RoadmapLayout from "@/app/boards/roadmap/layout";

describe("RoadmapLayout", () => {
  const mockProps = {
    children: <div data-testid="test-content">Test Content</div>,
  };

  it("renders children correctly", () => {
    render(RoadmapLayout(mockProps));
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("has correct styling classes", () => {
    const { container } = render(RoadmapLayout(mockProps));

    // Check main container
    const mainDiv = container.firstChild as HTMLElement;

    expect(mainDiv).toHaveClass("flex", "h-fit");

    // Check main content section
    const section = container.querySelector("section");

    expect(section).toHaveClass(
      "flex-grow",
      "flex",
      "flex-col",
      "items-center",
    );

    // Check content container
    const contentDiv = screen.getByTestId("test-content").parentElement;

    expect(contentDiv).toHaveClass(
      "inline-block",
      "w-full",
      "text-center",
      "justify-center",
    );
  });
});
